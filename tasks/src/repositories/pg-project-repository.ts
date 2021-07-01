import { ProjectListResponse, ProjectRepository } from "../services/interfaces";
import { Project } from "../models/project";
import { Pool } from "pg";
import { InternalError } from "../errors/internal-error";
export class PGProjectRepository implements ProjectRepository {
  private client: Pool;

  constructor(client: Pool) {
    this.client = client;
  }

  async create(p: Project): Promise<Project> {
    const text = `
        INSERT INTO projects (id, user_id, project) 
        VALUES ($1, $2, $3) RETURNING *
      `;
    const values = [p.id, p.userId, p.project];

    try {
      const queryRes = await this.client.query({
        text,
        values,
      });

      const createdProject = queryRes.rows[0];

      return projectFromData(createdProject);
    } catch (e) {
      console.debug("Error inserting project into database: ", e);
      throw new InternalError();
    }
  }

  async getByUser(options: {
    uid: string;
    limit: number;
    offset: number;
  }): Promise<ProjectListResponse> {
    const text = `
      WITH cte AS (
        SELECT *
        FROM projects
        WHERE user_id=$1 
      )
      
      SELECT * FROM (
        TABLE cte
        ORDER BY lower(project)
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

      const fetchedProjects = queryRes.rows;
      const count = parseInt(fetchedProjects[0].count);

      if (!fetchedProjects[0].id) {
        return {
          count,
          projects: [],
        };
      }

      const projects = fetchedProjects.map((project) =>
        projectFromData(project)
      );
      return {
        count,
        projects,
      };
    } catch (e) {
      console.debug("Error retrieving projects for user: ", e);
      throw new InternalError();
    }
  }

  // returns list of deleted projects
  async deleteByIds(projectIds: string[]): Promise<string[]> {
    // generate $1, $2, ..., $len(projectIds)
    const params = projectIds.map((_, index) => `\$${index + 1}`).join(",");

    // delete projects with projectIds and return their ids only
    const text = `
      DELETE FROM projects
      WHERE id IN (${params})
      RETURNING (id);
    `;

    try {
      const queryRes = await this.client.query({
        text,
        values: projectIds,
      });

      const deletedProjects = queryRes.rows;

      console.debug("Deleted projects: ", deletedProjects);

      return deletedProjects.map((dataObj) => dataObj.id);
    } catch (e) {
      console.debug("Error deleting projects from database: ", e);
      throw new InternalError();
    }
  }
  async update(p: Project): Promise<Project> {
    const text = `
        UPDATE projects 
        SET project=$1,
        WHERE id=$2 AND user_id=$3
        RETURNING *;
      `;
    const values = [p.project, p.id, p.userId];

    try {
      const queryRes = await this.client.query({
        text,
        values,
      });

      const updatedProject = queryRes.rows[0];

      return projectFromData(updatedProject);
    } catch (e) {
      console.debug("Error updating project in database: ", e);
      throw new InternalError();
    }
  }
}

const projectFromData = (dataObj: any): Project => ({
  id: dataObj.id,
  userId: dataObj.user_id,
  project: dataObj.project,
});
