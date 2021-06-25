import { Task } from "../models/task";

export interface ITaskService {
  getTasks(): Promise<Task>;
}