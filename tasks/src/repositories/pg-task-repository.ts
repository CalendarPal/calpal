import { TaskListResponse, TaskRepository } from "../services/interfaces";
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
        INSERT INTO tasks (id, user_id, task, description, ref_url, email_reminder, start_date, goal_date, project_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
      `;
    const values = [
      t.id,
      t.userId,
      t.task,
      t.description,
      t.refUrl,
      t.emailReminder,
      t.startDate,
      t.goalDate,
      t.projectId,
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

  async getByUser(options: {
    uid: string;
    limit: number;
    offset: number;
  }): Promise<TaskListResponse> {
    const text = `
      WITH cte AS (
        SELECT *
        FROM tasks
        WHERE user_id=$1 
      )
      
      SELECT * FROM (
        TABLE cte
        ORDER BY lower(task)
        LIMIT $2
        OFFSET $3
      ) sub
      RIGHT JOIN (SELECT count(*) FROM cte) c(count) ON true;
    `;
    const values = [options.uid, options.limit, options.offset];

    try {
      const queryRes = await this.client.query({
        text,
        values,
      });

      const fetchedTasks = queryRes.rows;
      const count = parseInt(fetchedTasks[0].count);

      if (!fetchedTasks[0].id) {
        return {
          count,
          tasks: [],
        };
      }

      const tasks = fetchedTasks.map((task) => taskFromData(task));
      return {
        count,
        tasks,
      };
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
        goal_date=$5,
        project_id=$6
        WHERE id=$7 AND user_id=$8
        RETURNING *;
      `;
    const values = [
      t.task,
      t.description,
      t.refUrl,
      t.emailReminder,
      t.goalDate,
      t.projectId,
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
  goalDate: dataObj.goal_date,
  userId: dataObj.user_id,
  task: dataObj.task,
  description: dataObj.description,
  projectId: dataObj.project_id,
});
