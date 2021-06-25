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
        INSERT INTO tasks (id, user_id, task, description, ref_url, email_reminder, start_date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `;
    const values = [
      t.id,
      t.userId,
      t.task,
      t.description,
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
      WHERE user_id=$1 
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
    const text = `
        UPDATE tasks 
        SET task=$1,
        description=$2,
        ref_url=$3,
        email_reminder=$4,
        start_date=$5
        WHERE id=$6 AND user_id=$7
        RETURNING *;
      `;
    const values = [
      t.task,
      t.description,
      t.refUrl,
      t.emailReminder,
      t.startDate,
      t.id,
      t.userId,
    ];

    try {
      const queryRes = await this.client.query({
        text,
        values,
      });

      const updatedTask = queryRes.rows[0];

      return taskFromData(updatedTask);
    } catch (e) {
      console.debug("Error updating task in database: ", e);
      throw new InternalError();
    }
  }
}

const taskFromData = (dataObj: any): Task => ({
  id: dataObj.id,
  emailReminder: dataObj.email_reminder,
  refUrl: dataObj.ref_url,
  startDate: dataObj.start_date,
  userId: dataObj.user_id,
  task: dataObj.task,
  description: dataObj.description,
});
