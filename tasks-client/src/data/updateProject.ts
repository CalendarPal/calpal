import { doRequest } from "./doRequest";
import { Project } from "./fetchProjects";

type UpdateProjectData = Project;
type UpdateProjectInput = {
  idToken?: string;
  id?: string;
  project: string;
};

const updateProject = async ({ idToken, id, project }: UpdateProjectInput) => {
  const url = id ? `/api/projects/${id}` : `/api/projects`;
  const method = id ? "put" : "post";
  const bodyData = id
    ? {
        project,
      }
    : { project };

  const { data, error } = await doRequest<UpdateProjectData>({
    method,
    url,
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    data: bodyData,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Unknown error");
  }

  return data;
};

export default updateProject;
