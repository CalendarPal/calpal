import { TaskRepository } from "../services/interfaces";
import { Task } from "../models/task";
import { Pool } from "pg";
import { InternalError } from "../errors/internal-error";
export class PGTaskRepository implements TaskRepository {
  private client: Pool;

  constructor(client: Pool) {
    this.client = client;
  }

  async create(t: Task): Promise<Task> {
    const text = `
        INSERT INTO tasks (id, userId, email, task, ref_url, email_reminder, start_date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `;
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
      ORDER BY lower(task);
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
      console.debug("Error retrieving tasks for user: ", e);
      throw new InternalError();
    }
  }

  // returns list of deleted tasks
  async deleteByIds(taskIds: string[]): Promise<string[]> {
    // generate $1, $2, ..., $len(taskIds)
    const params = taskIds.map((_, index) => `\$${index + 1}`).join(",");

    // delete tasks with taskIds and return their ids only
    const text = `
      DELETE FROM tasks
      WHERE id IN (${params})
      RETURNING (id);
    `;

    try {
      const queryRes = await this.client.query({
        text,
        values: taskIds,
      });

      const deletedTasks = queryRes.rows;

      console.debug("Deleted tasks: ", deletedTasks);

      return deletedTasks.map((dataObj) => dataObj.id);
    } catch (e) {
      console.debug("Error deleting tasks from database: ", e);
      throw new InternalError();
    }
  }
  async update(t: Task): Promise<Task> {
    throw new Error("Method not implemented.");
  }
}

const taskFromData = (dataObj: any): Task => ({
  id: dataObj.id,
  email: dataObj.email,
  emailReminder: dataObj.email_reminder,
  refUrl: dataObj.ref_url,
  startDate: dataObj.start_date,
  userId: dataObj.userid,
  task: dataObj.task,
  description: dataObj.description,
});
