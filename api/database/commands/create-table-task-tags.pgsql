CREATE TABLE task_tags (
        task_id string NOT NULL,
        tags varchar[]
        CONSTRAINT task_id_fk 
        FOREIGN key (task_id) REFERENCES task(id) ON DELETE CASCADE
)