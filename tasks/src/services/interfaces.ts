import { Task } from "../models/task";

export interface TaskRepository {
  create(t: Task): Promise<Task>;
  getByUser(uid: string): Promise<Task[]>;
}
