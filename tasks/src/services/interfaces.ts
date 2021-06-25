import { Task } from "../models/task";

export interface TaskRepository {
  create(t: Task): Promise<Task>;
  getByUser(uid: string): Promise<Task[]>;
  deleteByIds(taskId: string[]): Promise<string[]>;
  update(t: Task): Promise<Task>;
}
