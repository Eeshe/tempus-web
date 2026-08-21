import { Project } from "./project.model";

export interface Task {
  id: number;
  name: string;
  userId: number;
  project: Project;
  createdAt: string;
}
