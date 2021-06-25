import { Task } from "../models/task";
import { User } from "../models/user";

export interface TaskRepository {
  create(t: Task): Promise<Task>;
  getByUser(uid: string): Promise<Task[]>;
  deleteByIds(taskId: string[]): Promise<string[]>;
  update(t: Task): Promise<Task>;
}

export interface UserRepository {
  upsert(u: User): Promise<User>;
}
