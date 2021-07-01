import { Project } from "../models/project";
import { Task } from "../models/task";
import { User } from "../models/user";

export interface ProjectListResponse {
  projects: Project[];
  count: number;
}

export interface ProjectRepository {
  create(p: Project): Promise<Project>;
  getByUser(options: {
    uid: string;
    limit: number;
    offset: number;
  }): Promise<ProjectListResponse>;
  deleteByIds(projectId: string[]): Promise<string[]>;
  update(p: Project): Promise<Project>;
}

export interface TaskListResponse {
  tasks: Task[];
  count: number;
}

export interface TaskRepository {
  create(t: Task): Promise<Task>;
  getByUser(options: {
    uid: string;
    limit: number;
    offset: number;
  }): Promise<TaskListResponse>;
  deleteByIds(taskId: string[]): Promise<string[]>;
  update(t: Task): Promise<Task>;
}

export interface UserRepository {
  upsert(u: User): Promise<User>;
}
