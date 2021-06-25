export interface Task {
  id: string;
  userId: string;
  email: string;
  task: string;
  description: string;
  refUrl: string;
  emailReminder: Boolean;
  startDate: Date;
}
