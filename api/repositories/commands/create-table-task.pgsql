CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE task (
        id uuid DEFAULT uuid_generate_v4(),
        project_id uuid NOT NULL,
        assignee_id uuid,
        points int,
        title varchar(255),
        description varchar(255),
        status int,
        PRIMARY key (id),
        CONSTRAINT task_project FOREIGN key (project_id) REFERENCES project(id),
        CONSTRAINT task_assignee FOREIGN key (assignee_id) REFERENCES "user"(id),
        CONSTRAINT status FOREIGN key (status) REFERENCES task_status(id)
)