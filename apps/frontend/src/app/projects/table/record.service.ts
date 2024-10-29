import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Record } from './models/record';
import { NotificationService } from '../../common/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  private api = 'https://localhost:3000/records';
  selectedUserID = "0000000";
  
  constructor(private http: HttpClient, private notifyService: NotificationService) {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      this.api = 'https://jeffreysanford.us:3000/';
      this.notifyService.showSuccess('Running in production mode', 'Production');      
    } else {      
      this.notifyService.showSuccess('Running in development mode', 'Development');
    }
   }

  // Method to get a record by UID
  getRecordByUID(UID: string): Observable<Record> {
    const url = `${this.api}/${UID}`;
    console.log(`Fetching record by UID: ${UID}`);
    return this.http.get<Record>(url);
  }

  // Method to get all records
  getAllRecords(): Observable<Record[]> {
    console.log('Fetching all records');
    return this.http.get<Record[]>(this.api);
  }

  // sets the currently selected user to prepare to user detail presentation
  setSelectedUID(uid: string): void {
    console.log(`Setting selected user ID: ${uid}`);
    this.selectedUserID = uid;
  }

  getSelectedUID(): string {
    console.log('Getting selected user ID');
    return this.selectedUserID;
  }

  generateNewRecordSet(count: number): Observable<Record[]> {
    const url = `${this.api}/generate?count=${count}`;
    console.log(`Generating new record set with count: ${count}`);
    return this.http.get<Record[]>(url);
  }

  getCreationTime(): Observable<number> {
    const url = `${this.api}/time`;
    console.log('Fetching creation time');
    return this.http.get<number>(url);
  }
}