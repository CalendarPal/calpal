import { doRequest } from "./doRequest";

export interface FetchTaskArgs {
  page: number;
  limit: number;
  idToken?: string;
}

export interface FetchTaskData {
  count: number;
  page: number;
  pages: number;
  limit: number;
  tasks: Task[];
}

export interface Task {
  id: string;
  userId: string;
  task: string;
  description: string;
  refUrl: string;
  emailReminder: Boolean;
  startDate: string;
}

export const fetchTasks = async (
  key: string,
  args: FetchTaskArgs
): Promise<FetchTaskData> => {
  const { data, error } = await doRequest<FetchTaskData>({
    method: "get",
    url: "/api/tasks",
    params: {
      page: args.page,
      limit: args.limit,
    },
    headers: {
      Authorization: `Bearer ${args.idToken}`,
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
