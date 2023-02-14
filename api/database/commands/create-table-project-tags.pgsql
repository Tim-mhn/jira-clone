CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE project_tags (
        id uuid DEFAULT uuid_generate_v4(),
        project_id varchar NOT NULL,
        tag varchar NOT NULL,
        CONSTRAINT tag_project_fk FOREIGN key (project_id) REFERENCES project(id) ON DELETE CASCADE,
        PRIMARY key (id)
)