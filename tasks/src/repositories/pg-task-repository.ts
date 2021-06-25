import { TaskRepository } from "../services/interfaces";
import { Task } from "../models/task";
import { CustomError } from "../errors/custom-error";
import { Pool } from "pg";

export class PGTaskRepository implements TaskRepository {
  private client: Pool;

  constructor(client: Pool) {
    this.client = client;
  }

  create(t: Task): Promise<Task> {
    throw new Error("Method not implemented.");
  }
}
