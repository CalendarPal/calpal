import { TaskRepository } from "./interfaces";
import { CustomError } from "../errors/custom-error";
import { Task } from "../models/task";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { nextTick } from "process";

interface TaskInput {
  task: string;
  refUrl?: string;
  emailReminder: boolean;
}

interface UserInput {
  id: string;
  email: string;
}

export class TaskService {
  private r: TaskRepository;

  constructor(r: TaskRepository) {
    this.r = r;
  }

  async addTask(task: TaskInput, user: UserInput): Promise<Task> {
    return {
      id: "abc123",
      email: "bob@bob.com",
      emailReminder: false,
      userId: "123",
      task: "A task",
    };
  }
}
