import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TimeEntry } from "../model/time-entry.model";

interface CreateTimeEntryRequest {
  groupId: number | null;
  userId: number;
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

@Injectable({ providedIn: 'root' })
export class TimeEntryService {
  private readonly url: string = "/api/v1/time-entries";

  constructor(private http: HttpClient) { }

  listTimeEntries(): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(this.url, { withCredentials: true });
  }

  continueTimeEntry(timeEntry: TimeEntry): Observable<TimeEntry> {
    const createRequest: CreateTimeEntryRequest = {
      groupId: timeEntry.groupId,
      userId: timeEntry.userId,
      projectId: timeEntry.project.id,
      taskId: timeEntry.task ? timeEntry.task.id : null,
      description: timeEntry.description,
      isBillable: timeEntry.isBillable,
      startTime: new Date().toISOString(),
      endTime: null,
    };
    return this.http.post<TimeEntry>(this.url, createRequest, { withCredentials: true });
  }

  updateTimeEntryDescription(timeEntry: TimeEntry, newDescription: string): Observable<TimeEntry> {
    const patchRequest: Partial<PatchTimeEntryRequest> = {
      description: newDescription,
    }
    return this.http.patch<TimeEntry>(`${this.url}/${timeEntry.id}`, patchRequest, { withCredentials: true })
  }

  deleteTimeEntry(timeEntry: TimeEntry): Observable<void> {
    return this.http.delete<void>(`${this.url}/${timeEntry.id}`, { withCredentials: true });
  }
}
