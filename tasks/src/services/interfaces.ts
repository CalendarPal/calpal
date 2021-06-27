import { Task } from "../models/task";
import { User } from "../models/user";

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
