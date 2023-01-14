WITH sub AS (
SELECT t.id, ROW_NUMBER () OVER (
		PARTITION BY t.sprint_id
	)
FROM task t
)
UPDATE task t
SET number=s.row_number
FROM sub s
WHERE s.id=t.id


-- 2 last lines (joins) added to transform task number into 'WP-xxxx' with project.key

SELECT task.id as task_id, 
	task.title as task_title,
	task.points as task_points,
	task.description as task_description,
	COALESCE(task.status, 0) as task_status,
	COALESCE(task_status.label, '') as task_status_label,
	task_status.color as task_status_color,
	assignee_id,
	COALESCE("user".name, '') as user_name,
	COALESCE("user".email, '') as user_email,
CONCAT(project.key, '-',task.number ) as new_num
	from task
	LEFT JOIN "user" ON assignee_id="user".id
	LEFT JOIN task_status ON task_status.id=task.status
LEFT JOIN task_position ON task_position.task_id=task.id 
LEFT JOIN sprint ON sprint.id=task.sprint_id
LEFT JOIN project ON sprint.project_id=project.id
WHERE task.sprint_id='66fc0b91-bda9-4371-9fdb-81c5bdd77828' 
ORDER BY task_position.position ASC

