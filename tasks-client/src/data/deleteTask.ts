import { doRequest } from "./doRequest";

type DeleteTaskData = {
  ids: string[];
};
type DeleteTaskInput = {
  idToken?: string;
  id: string;
};

const deleteTask = async ({ idToken, id }: DeleteTaskInput) => {
  const { data, error } = await doRequest<DeleteTaskData>({
    method: "post",
    url: `/api/tasks/delete`,
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      taskIds: [id],
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

export default deleteTask;
