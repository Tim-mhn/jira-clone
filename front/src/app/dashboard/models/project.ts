import { ProjectMember } from './project-member';
import { Tasks } from './task';

export interface Project {
  Id: string;
  Name: string;
}

export type Projects = Project[];

// todo: API should return list of tasks (concept of sprints to be added later on)

export type ProjectWithMembers = Project & {
  Members: ProjectMember[];
};

export type ProjectWithMembersAndTasks = ProjectWithMembers & {
  Tasks: Tasks;
};
