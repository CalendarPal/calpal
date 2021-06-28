import { doRequest } from "./doRequest";
import { Task } from "./fetchTasks";

type UpdateTaskData = Task;
type UpdateTaskInput = {
  idToken?: string;
  id?: string;
  task: string;
  description: string;
  refUrl: string;
  startDate?: string;
  goalDate?: string;
};

const updateTask = async ({
  idToken,
  id,
  task,
  description,
  refUrl,
  startDate,
  goalDate,
}: UpdateTaskInput) => {
  const url = id ? `/api/tasks/${id}` : `/api/tasks`;
  const method = id ? "put" : "post";
  const bodyData = id
    ? {
        task,
        description,
        refUrl,
        startDate,
        goalDate,
      }
    : { task, description, refUrl };

  const { data, error } = await doRequest<UpdateTaskData>({
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

export default updateTask;
