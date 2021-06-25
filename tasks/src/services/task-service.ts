import { v4 } from "uuid";
import { TaskRepository } from "./interfaces";
import { Task } from "../models/task";

interface CreateData {
  task: string;
  description: string;
  refUrl?: string;
  emailReminder?: boolean;
  startDate?: Date;
  uid: string;
  email: string;
}

interface UpdateData {
  id: string;
  task: string;
  uid: string;
  description: string;
  refUrl: string;
  emailReminder: boolean;
  startDate: Date;
}

export class TaskService {
  private tr: TaskRepository;

  constructor(r: TaskRepository) {
    this.tr = r;
  }

  async addTask(t: CreateData): Promise<Task> {
    const id = v4();
    const createdTask = this.tr.create({
      id,
      task: t.task,
      description: t.description,
      refUrl: t.refUrl ?? "",
      emailReminder: t.emailReminder ?? false,
      userId: t.uid,
      startDate: new Date(),
    });

    return createdTask;
  }

  async getTasks(userId: string): Promise<Task[]> {
    const tasks = await this.tr.getByUser(userId);

    return tasks;
  }

  async deleteTasks(taskIds: string[]): Promise<string[]> {
    const deletedIds = await this.tr.deleteByIds(taskIds);

    return deletedIds;
  }

  async updateTask(t: UpdateData): Promise<Task> {
    const updatedTask = this.tr.update({
      id: t.id,
      task: t.task,
      description: t.description,
      refUrl: t.refUrl,
      emailReminder: t.emailReminder,
      userId: t.uid,
      startDate: t.startDate,
    });

    return updatedTask;
  }
}
