import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddLine } from '../classes/addline';
import { AddStation } from '../classes/addStation';

@Injectable()
export class LineHttpService{
    base_url = "http://localhost:52295"
    constructor(private http: HttpClient){ }

    getAll() : Observable<any>{
        return Observable.create((observer) => {    
            this.http.get<any>(this.base_url + "/api/LineEdit/Lines").subscribe(data =>{
                observer.next(data);
                observer.complete();     
            })             
        });
    }

    getLine(id: string) : Observable<any>{
        return Observable.create((observer) => {    
            this.http.get<any>(this.base_url + "/api/LineEdit/SelectedLine/" + id).subscribe(data =>{
                observer.next(data);
                observer.complete();     
            })             
        });
    }

    getStations(id: string) : Observable<any>{
        return Observable.create((observer) => {    
            this.http.get<any>(this.base_url + "/api/LineEdit/GetStations/" + id).subscribe(data =>{
                observer.next(data);
                observer.complete();     
            })             
        });
    }

    getAllStations() : Observable<any>{
        return Observable.create((observer) => {    
            this.http.get<any>(this.base_url + "/api/LineEdit/GetAllStations").subscribe(data =>{
                observer.next(data);
                observer.complete();     
            })             
        });
    }

    getSelectedStation(name: string) : Observable<any>{
        return Observable.create((observer) => {    
            this.http.get<any>(this.base_url + "/api/StationEdit/GetSelectedStation/" + name).subscribe(data =>{
                observer.next(data);
                observer.complete();     
            })             
        });
    }

    deleteSelectedLine(id: string) : Observable<any>{
        return Observable.create((observer) => {    
            this.http.delete<any>(this.base_url + "/api/LineEdit/DeleteSelectedLine/" + id).subscribe(data =>{
                observer.next(data);
                observer.complete();     
            })             
        });
    }

    addLine(line: string) : Observable<any>{

        return Observable.create((observer) => {
            let data = line;
            let httpOptions={
                headers:{
                    "Content-type": "application/json"
                }
            }
            this.http.post<any>(this.base_url + "/api/Line/AddLine/" + data ,httpOptions).subscribe(data => {
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
}