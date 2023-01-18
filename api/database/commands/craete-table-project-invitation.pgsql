CREATE TABLE project_invitation (
id uuid DEFAULT uuid_generate_v4(),
project_id varchar NOT NULL,
guest_email varchar NOT NULL,
token uuid DEFAULT uuid_generate_v4() UNIQUE,
expiration_date Date DEFAULT now() + interval '2 day',
used boolean DEFAULT false,
CONSTRAINT sprint_project FOREIGN key (project_id) REFERENCES project(id),
PRIMARY key (id)
)

