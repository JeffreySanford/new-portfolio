import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Record } from '../models/record';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  private baseUrl = 'http://localhost:3000/api/records';
  selectedUserID = "0000000";

  constructor(private http: HttpClient) { }

  // Method to get a record by UID
  getRecordByUID(UID: string): Observable<Record> {
    const url = `${this.baseUrl}/${UID}`;
    
    return this.http.get<Record>(url);
  }

  // Method to get all records
  getAllRecords(): Observable<Record[]> {
    
    return this.http.get<Record[]>(this.baseUrl);
  }

  // sets the currently selected user to prepare to user detail presentation
  setSelectedUID(uid: string): void {
    this.selectedUserID = uid;
  }

  getSelectedUID(): string {

    return this.selectedUserID;
  }

  generateNewRecordSet(count: number): Observable<Record[]> {
    const url = `${this.baseUrl}/generate?count=${count}`;
    
    return this.http.get<Record[]>(url);
  }

  getCreationTime(): Observable<number> {
    const url = `${this.baseUrl}/time`;
    
    return this.http.get<number>(url);
  }
}
