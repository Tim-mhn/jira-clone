CREATE TABLE sprint (
            id uuid DEFAULT uuid_generate_v4(),
            name varchar(255) NOT NULL DEFAULT(''),
            project_id uuid NOT NULL,
            is_backlog bool,
            CONSTRAINT sprint_project FOREIGN key (project_id) REFERENCES project(id)
            PRIMARY key (id),



)