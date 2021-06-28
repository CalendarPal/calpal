export interface Task {
  id: string;
  userId: string;
  task: string;
  description: string;
  refUrl: string;
  emailReminder: Boolean;
  startDate: Date;
  goalDate: Date;
}

// TODO: Create a project/category model (?), allowing users to group like minded tasks together (e.g "English Class")

// TODO: Implement task completion state (Pending, In progress, Completed)

// TODO: Implement the emailReminder on tasks functionality
