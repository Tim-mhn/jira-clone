CREATE TABLE project_user (
    project_id uuid REFERENCES project(id),
    user_id uuid REFERENCES "user"(id),
    CONSTRAINT project_user_id PRIMARY key (project_id, user_id)
)