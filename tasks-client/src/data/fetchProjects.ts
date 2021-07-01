import { doRequest } from "./doRequest";

export interface FetchProjectArgs {
  limit: number;
  idToken?: string;
}

export interface FetchProjectData {
  count: number;
  page: number;
  pages: number;
  limit: number;
  projects: Project[];
}

export interface Project {
  id: string;
  userId: string;
  project: string;
}

export const fetchProjects = async (
  key: string,
  args: FetchProjectArgs,
  page: number = 1
): Promise<FetchProjectData> => {
  // if (args.idToken === "") {
  //   const temp = new FetchProjectData();
  //   return temp;
  // }
  const { data, error } = await doRequest<FetchProjectData>({
    method: "get",
    url: "/api/projects",
    params: {
      page: page,
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
  console.log(data);
  return data;
};
