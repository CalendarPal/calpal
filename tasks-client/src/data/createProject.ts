import { doRequest } from "./doRequest";
import { Project } from "./fetchProjects";

type CreateProjectData = Project;
type CreateProjectInput = {
  idToken: string;
  project: string;
};

const createProject = async ({ idToken, project }: CreateProjectInput) => {
  const { data, error } = await doRequest<CreateProjectData>({
    method: "post",
    url: "/api/projects",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      project,
    },
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Unknown error");
  }

  return data;
};

export default createProject;
