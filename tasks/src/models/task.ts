export interface Task {
  id: string;
  userId: string;
  email: string;
  task: string;
  refUrl: string;
  emailReminder: Boolean;
  startDate: Date;
}

export const taskFromData = (dataObj: any): Task => ({
  id: dataObj.id,
  email: dataObj.email,
  emailReminder: dataObj.email_reminder,
  refUrl: dataObj.ref_url,
  startDate: dataObj.start_date,
  userId: dataObj.userid,
  task: dataObj.task,
});
