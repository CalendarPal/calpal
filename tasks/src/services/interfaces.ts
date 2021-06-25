import { Task } from "../models/task";

export interface TaskRepository {
    create(t: Task): Promise<Task>;
}
