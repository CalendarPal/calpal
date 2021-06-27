import { doRequest } from "./doRequest";
import { Task } from "./fetchTasks";

type CreateTaskData = Task;
type CreateTaskInput = {
  idToken: string;
  task: string;
  description: string;
  refUrl: string;
};

const createTask = async ({
  idToken,
  task,
  description,
  refUrl,
}: CreateTaskInput) => {
  const { data, error } = await doRequest<CreateTaskData>({
    method: "post",
    url: "/api/tasks",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    data: {
      task,
      description,
      refUrl,
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

export default createTask;
