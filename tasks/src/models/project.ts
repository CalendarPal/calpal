import { Task } from "./task";

export interface Project {
  id: string;
  userId: string;
  project: string;
  taskCount?: number;
  tasks?: Task[];
}
