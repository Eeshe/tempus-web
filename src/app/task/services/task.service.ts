import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import { Task } from "../models/task.model";

interface PatchTaskRequest {
  name: string | null,
}

@Service()
export class TaskService {
  private readonly url: string = "/api/v1/tasks";
  private http: HttpClient = inject(HttpClient);

  patchTaskName(task: Task, newName: string): Observable<Task> {
    const patchTaskRequest: Partial<PatchTaskRequest> = {
      name: newName,
    }
    return this.http.patch<Task>(`${this.url}/${task.id}`, patchTaskRequest, { withCredentials: true });
  }

  deleteTask(task: Task): Observable<void> {
    return this.http.delete<void>(`${this.url}/${task.id}`, { withCredentials: true });
  }
}
