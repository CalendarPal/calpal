export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  userId: string;
  startDate: string;
  goalDate: string;
  createdAt: string;
  updatedAt: string;
  project: Project;
  // Virtual fields
  url: string;
  noteCount?: number;
}

export interface User {
  createdAt: string;
  email: string;
  imageUrl: string;
  name: string;
  uid: string;
  updatedAt: string;
  website: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  // Virtual fields
  taskCount?: number;
}

export interface Note {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  task?: Task;
  // Virtuals
}
