import { doRequest } from "./doRequest";

type DeleteProjectData = {
  ids: string[];
};
type DeleteProjectInput = {
  idToken?: string;
  id: string;
};

const deleteProject = async ({ idToken, id }: DeleteProjectInput) => {
  const { data, error } = await doRequest<DeleteProjectData>({
    method: "post",
    url: `/api/projects/delete`,
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      projectIds: [id],
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

export default deleteProject;
