export interface Task {
  id: string;
  userId: string;
  email: string;
  task: string;
  refUrl: string;
  emailReminder: Boolean;
  startDate: Date;
}
