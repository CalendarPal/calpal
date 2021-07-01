import { v4 } from "uuid";
import { ProjectListResponse, ProjectRepository } from "./interfaces";
import { Project } from "../models/project";

interface CreateData {
  project: string;
  uid: string;
}

interface UpdateData {
  id: string;
  project: string;
  uid: string;
}

export class ProjectService {
  private pr: ProjectRepository;

  constructor(r: ProjectRepository) {
    this.pr = r;
  }

  async addProject(p: CreateData): Promise<Project> {
    const id = v4();
    const createdProject = this.pr.create({
      id,
      project: p.project,
      userId: p.uid,
    });

    return createdProject;
  }

  async getProjects(options: {
    userId: string;
    limit?: number;
    page?: number;
  }) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const offset = (page - 1) * limit;

    const projectResponse = await this.pr.getByUser({
      uid: options.userId,
      limit,
      offset,
    });

    const pages = Math.ceil(projectResponse.count / limit);

    return { ...projectResponse, page, pages, limit };
  }

  async deleteProjects(projectIds: string[]): Promise<string[]> {
    const deletedIds = await this.pr.deleteByIds(projectIds);

    return deletedIds;
  }

  async updateProject(p: UpdateData): Promise<Project> {
    const updatedProject = this.pr.update({
      id: p.id,
      project: p.project,
      userId: p.uid,
    });

    return updatedProject;
  }
}
