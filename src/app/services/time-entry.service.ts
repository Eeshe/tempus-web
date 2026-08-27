import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../model/project.model";
import { TimeEntry } from "../model/time-entry.model";

interface CreateTimeEntryRequest {
  groupId: number | null;
  projectId: number;
  taskId: number | null;
  description: string | null;
  isBillable: boolean;
  startTime: string;
  endTime: string | null;
}

interface PatchTimeEntryRequest {
  groupId: number
  userId: number
  projectId: number
  taskId: number
  description: string
  isBillable: boolean
  startTime: string
  endTime: string
}

@Service()
export class TimeEntryService {
  private readonly url: string = "/api/v1/time-entries";
  private http: HttpClient = inject(HttpClient);

  listTimeEntries(): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(this.url, { withCredentials: true });
  }

  createTimeEntry(
    groupId: number | null,
    projectId: number,
    taskId: number | null,
    description: string | null,
    isBillable: boolean,
    startTime: string,
    endTime: string | null
  ): Observable<TimeEntry> {
    const createRequest: CreateTimeEntryRequest = {
      groupId,
      projectId,
      taskId,
      description,
      isBillable,
      startTime,
      endTime
    };
    return this.http.post<TimeEntry>(this.url, createRequest, { withCredentials: true });
  }

  resumeTimeEntry(timeEntry: TimeEntry): Observable<TimeEntry> {
    const createRequest: CreateTimeEntryRequest = {
      groupId: timeEntry.groupId,
      projectId: timeEntry.project.id,
      taskId: timeEntry.task ? timeEntry.task.id : null,
      description: timeEntry.description,
      isBillable: timeEntry.isBillable,
      startTime: new Date().toISOString(),
      endTime: null,
    };
    return this.http.post<TimeEntry>(this.url, createRequest, { withCredentials: true });
  }

  patchTimeEntryDescription(timeEntry: TimeEntry, newDescription: string): Observable<TimeEntry> {
    const patchRequest: Partial<PatchTimeEntryRequest> = {
      description: newDescription,
    }
    return this.patchTimeEntry(timeEntry, patchRequest);
  }

  patchTimeEntryBillable(timeEntry: TimeEntry, newBillableStatus: boolean): Observable<TimeEntry> {
    const patchRequest: Partial<PatchTimeEntryRequest> = {
      isBillable: newBillableStatus,
    }
    return this.patchTimeEntry(timeEntry, patchRequest);
  }

  patchTimeEntryEndTime(timeEntry: TimeEntry, endTime: Date): Observable<TimeEntry> {
    const patchRequest: Partial<PatchTimeEntryRequest> = {
      endTime: endTime.toISOString(),
    }
    return this.patchTimeEntry(timeEntry, patchRequest)
  }

  patchTimeEntryProject(timeEntry: TimeEntry, project: Project): Observable<TimeEntry> {
    const patchRequest: Partial<PatchTimeEntryRequest> = {
      projectId: project.id,
    }
    return this.patchTimeEntry(timeEntry, patchRequest)
  }

  private patchTimeEntry(timeEntry: TimeEntry, patchRequest: Partial<PatchTimeEntryRequest>): Observable<TimeEntry> {
    return this.http.patch<TimeEntry>(`${this.url}/${timeEntry.id}`, patchRequest, { withCredentials: true })
  }

  deleteTimeEntry(timeEntry: TimeEntry): Observable<void> {
    return this.http.delete<void>(`${this.url}/${timeEntry.id}`, { withCredentials: true });
  }
}
