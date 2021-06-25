import { TaskRepository } from "../services/interfaces";
import { Task, taskFromData } from "../models/task";
import { Pool } from "pg";
import { InternalError } from "../errors/internal-error";
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

      return taskFromData(createdTask);
    } catch (e) {
      console.debug("Error inserting task into database: ", e);
      throw new InternalError();
    }
  }

  async getByUser(uid: string): Promise<Task[]> {
    const text = `
      SELECT * FROM tasks 
      WHERE userid=$1 
      ORDER BY lower(task)
    `;
    const values = [uid];

    try {
      const queryRes = await this.client.query({
        text,
        values,
      });

      const fetchedTasks = queryRes.rows;

      return fetchedTasks.map((task) => taskFromData(task));
    } catch (e) {
      console.debug("Error inserting task into database: ", e);
      throw new InternalError();
    }
  }
}
