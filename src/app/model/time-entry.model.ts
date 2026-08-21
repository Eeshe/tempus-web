import { Project } from "./project.model";
import { Task } from "./task.model";

export interface TimeEntry {
  id: number;
  userId: number;
  groupId: number | null;
  project: Project;
  task: Task | null;
  description: string | null;
  isBillable: boolean;
  startTime: string;
  endTime: string | null;
  createdAt: string;

}
