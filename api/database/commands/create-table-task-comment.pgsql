CREATE TABLE task_comment (
 id uuid DEFAULT uuid_generate_v4(),
created_on date DEFAULT now(),
text varchar DEFAULT '',
deleted bool DEFAULT false,
author_id varchar NOT NULL,
task_id varchar NOT NULL,
PRIMARY key (id),
CONSTRAINT comment_author_fk FOREIGN key (author_id) REFERENCES "user"(id),
CONSTRAINT comment_task_fk FOREIGN key (task_id) REFERENCES task(id)

)