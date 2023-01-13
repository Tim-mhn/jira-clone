package tasks_repositories

import (
	"database/sql"
	"fmt"
	"log"

	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
)

type TaskPositionRepository struct {
	conn *sql.DB
}

func NewTaskPositionRepository(conn *sql.DB) *TaskPositionRepository {
	return &TaskPositionRepository{
		conn: conn,
	}
}

func (taskPositionRepo *TaskPositionRepository) MoveTaskBetween(taskToMoveId string, moveDTO tasks_dtos.MoveTaskDTO) error {

	query, err := buildQuery(taskToMoveId, moveDTO.PreviousTaskId, moveDTO.NextTaskId)

	if err != nil {
		return err
	}

	log.Printf(`[NewTaskPositionRepository.MoveTasksBetween] SQL Query = %s`, query)

	res, err := taskPositionRepo.conn.Exec(query)

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("error no rows changed")
	}

	return err
}

func computeNewPositionQuery(taskToMoveId string, precedingTaskId string, followingTaskId string) (string, error) {

	var query string

	taskIsInBetweenTasks := followingTaskId != "" && precedingTaskId != ""

	if taskIsInBetweenTasks {
		query = averagePositionBetweenTasksQuery(precedingTaskId, followingTaskId)
	} else if taskIsAtStart := followingTaskId != ""; taskIsAtStart {
		query = edgeTaskPositionQuery(taskToMoveId, Start)
	} else if taskIsAtEnd := precedingTaskId != ""; taskIsAtEnd {
		query = edgeTaskPositionQuery(taskToMoveId, End)

	} else {
		return "", fmt.Errorf("[TaskPositionRepository.MoveTaskBetween] : no previous or next task")

	}

	return query, nil
}

func buildQuery(taskToMoveId string, precedingTaskId string, followingTaskId string) (string, error) {
	newPositionQuery, err := computeNewPositionQuery(taskToMoveId, precedingTaskId, followingTaskId)

	if err != nil {
		return "", err
	}

	updatePositionQuery := fmt.Sprintf(`WITH new_position
AS
(%s)
UPDATE task_position 
SET position=new_position.pos
FROM new_position 
WHERE task_position.task_id='%s'`, newPositionQuery, taskToMoveId)

	return updatePositionQuery, nil

}

func averagePositionBetweenTasksQuery(precedingTaskId string, followingTaskId string) string {
	return fmt.Sprintf(`SELECT 
   AVG(position) as pos
   FROM task_position 
   WHERE task_position.task_id IN ('%s', '%s')`, precedingTaskId, followingTaskId)
}

type sprintEdge string

const (
	Start sprintEdge = "MIN"
	End   sprintEdge = "MAX"
)

func edgeTaskPositionQuery(taskToMoveId string, edge sprintEdge) string {

	var delta = 1
	if edge == Start {
		delta = -1
	}

	return fmt.Sprintf(`SELECT %s(position) + %d as pos
FROM task_position tp
JOIN task ON tp.task_id=task.id
WHERE task.sprint_id =(SELECT task.sprint_id
FROM task
WHERE task.id='%s' LIMIT 1)`, edge, delta, taskToMoveId)
}
