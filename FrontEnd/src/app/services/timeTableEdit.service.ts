import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Timetable } from '../classes/timetable';

@Injectable()
export class TimetableEditHttpService{
    base_url = "http://localhost:52295"
    constructor(private http: HttpClient){ }

    getAll() : Observable<any>{
        return Observable.create((observer) => {    
            this.http.get<any>(this.base_url + "/api/timetable/timetableEditGetAll").subscribe(data =>{
                observer.next(data);
                observer.complete();     
            })             
        });
    }

    addTimetable(timetable: Timetable) : Observable<any>{

        return Observable.create((observer) => {
            let data = timetable;
            let httpOptions={
                headers:{
                    "Content-type": "application/json"
                }
            }
            this.http.post<any>(this.base_url + "/api/timetable/AddTimetable",data,httpOptions).subscribe(data => {
                observer.next("success");
                observer.complete();
            },
            err => {
                console.log(err);
                observer.next("unsuccessfull");
                observer.complete();
            });
        });
    }

    getTimetable(timetable: Timetable) : Observable<any>{
        return Observable.create((observer) => {
            let data = timetable;
            
            this.http.get<any>(this.base_url + "/api/timetable/GetTimetable/" + data.Id + "/" + data.TimtableTypeId + "/" + data.DayTypeId).subscribe(data =>{
                observer.next(data);
                observer.complete();
            },
            err => {
                console.log(err);
                observer.next("unsuccessfull");
                observer.complete();
            });
        });
    }

    updateTimetable(timetable: Timetable): Observable<any>{
        return Observable.create((observer) => {
            let data = timetable;
            let httpOptions={
                headers:{
                    "Content-type": "application/json"
                }
            }
            this.http.post<any>(this.base_url + "/api/timetable/UpdateTimetable",data,httpOptions).subscribe(data => {
                observer.next("uspesno");
                observer.complete();
            },
            err => {
                console.log(err);
                observer.next("neuspesno");
                observer.complete();
            });
        });
    }

    deleteTimetable(timetable: Timetable): Observable<any>{
        return Observable.create((observer) => {
            let data = timetable;
            this.http.delete<any>(this.base_url + "/api/timetable/DeleteTimetable/" + data.Id + "/" + data.TimtableTypeId + "/" + data.DayTypeId).subscribe(data => {
                observer.next("success");
                observer.complete();
            },
            err => {
                console.log(err);
                observer.next("unsuccessfull");
                observer.complete();
            });
        });
    }

    getAllLines() : Observable<any>{
        return Observable.create((observer) => {    
            this.http.get<any>(this.base_url + "/api/LineEdit/Lines").subscribe(data =>{
                observer.next(data);
                observer.complete();     
            })             
        });
    }
}