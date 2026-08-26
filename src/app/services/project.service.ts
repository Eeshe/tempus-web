import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../model/project.model";

interface CreateProjectRequest {
  name: string;
  isPrivate: boolean;
  clientId: number | null;
}

interface PatchProjectRequest {
  name: string | null;
  isPrivate: boolean | null;
  clientId: number | null;
}

@Service()
export class ProjectService {
  private readonly url: string = "/api/v1/projects";
  private http: HttpClient = inject(HttpClient);

  listProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.url, { withCredentials: true });
  }

  createProject(name: string, isPrivate: boolean, clientId: number | null): Observable<Project> {
    const createProjectRequest: CreateProjectRequest = {
      name: name,
      isPrivate: isPrivate,
      clientId: clientId,
    };
    return this.http.post<Project>(this.url, createProjectRequest, { withCredentials: true });
  }

  deleteProject(project: Project): Observable<void> {
    return this.http.delete<void>(`${this.url}/${project.id}`, { withCredentials: true });
  }
}
