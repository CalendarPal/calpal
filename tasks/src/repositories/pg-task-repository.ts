import { TaskRepository } from "../services/interfaces";
import { Task } from "../models/task";
import { CustomError } from "../errors/custom-error";
import { Pool } from "pg";
import { InternalError } from "../errors/internal-error";
import { create } from "domain";
export class PGTaskRepository implements TaskRepository {
  private client: Pool;

  constructor(client: Pool) {
    this.client = client;
  }

  async create(t: Task): Promise<Task> {
    const text =
      "INSERT INTO tasks (id, userId, email, task, ref_url, email_reminder, start_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const values = [
      t.id,
      t.userId,
      t.email,
      t.task,
      t.refUrl,
      t.emailReminder,
      t.startDate,
    ];

    try {
      const queryRes = await this.client.query({
        text,
        values,
      });

      const createdTask = queryRes.rows[0];

      return {
        id: createdTask.id,
        email: createdTask.email,
        emailReminder: createdTask.email_reminder,
        refUrl: createdTask.ref_url,
        startDate: createdTask.start_date,
        userId: createdTask.userid,
        task: createdTask.task,
      };
    } catch (e) {
      console.debug("Error inserting task into database: ", e);
      throw new InternalError();
    }
  }
}
