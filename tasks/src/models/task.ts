export interface Task {
  id: string;
  userId: string;
  email: string;
  title: string;
  refUrl?: string;
  emailReminder: Boolean;
  startDate?: string;
}