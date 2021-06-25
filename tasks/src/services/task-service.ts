import { v4 } from "uuid";
import { TaskRepository } from "./interfaces";
import { Task } from "../models/task";

interface TaskData {
  task: string;
  refUrl?: string;
  emailReminder?: boolean;
}

interface UserData {
  id: string;
  email: string;
}

export class TaskService {
  private r: TaskRepository;

  constructor(r: TaskRepository) {
    this.r = r;
  }

  async addTask(t: TaskData, u: UserData): Promise<Task> {
    const id = v4();
    const createdTask = this.r.create({
      id,
      task: t.task,
      refUrl: t.refUrl ?? "",
      emailReminder: t.emailReminder ?? false,
      email: u.email,
      userId: u.id,
      startDate: new Date(),
    });

    return createdTask;
  }
}
