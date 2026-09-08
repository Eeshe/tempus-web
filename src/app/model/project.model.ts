import { Task } from "./task.model";

export interface Project {
  id: number;
  name: string;
  userId: number;
  isPrivate: boolean;
  tasks: Task[],
  clientId: number;
  createdAt: string;
}
