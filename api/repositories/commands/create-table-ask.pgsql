CREATE TABLE task (
        id uuid DEFAULT uuid_generate_v4(),
        name varchar(255) NOT NULL,
        project_id uuid NOT NULL,
        assignee_id uuid,
        PRIMARY key (id),
        CONSTRAINT task_project FOREIGN key (project_id) REFERENCES project(id),
        CONSTRAINT task_assignee FOREIGN key (assignee_id) REFERENCES "user"(id)
)