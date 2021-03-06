import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Line } from '../classes/line';
import { AddLine } from '../classes/addLine';
import { Station } from '../classes/station';
import { LineHttpService } from '../services/line.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LineComponent implements OnInit {

  constructor(private fb: FormBuilder,private router: Router,private http: LineHttpService) { }

  lineForm = this.fb.group({
    SerialNumber: ['', Validators.required],
  });

  stationForm = this.fb.group({
    Name: ['', Validators.required],
    Address: ['', Validators.required],
    X: ['', Validators.required],
    Y: ['', Validators.required],
  });

  selectedLine: string
  selectedStation: string
  lines: string[] = []
  stations: string[] = []
  line: Line = new Line()
  station: Station = new Station()
  StationsAdd: Array<string> = [];
  stationToChose: Array<string> = [];
  stationAddSelected: string
  temp: boolean = true
  serNum: number
  newLine: string 
  

  ngOnInit() {
    this.http.getAll().subscribe((line) => {
      this.lines = line;
      this.selectedLine = this.lines[0];
      err => console.log(err);
    });    
    this.http.getAllStations().subscribe((data) => {
      this.stationToChose = data;
      this.stationAddSelected = this.stationToChose[5];
      err => console.log(err);
    });
  }

  getSelectedLine(){
    this.http.getLine(this.selectedLine).subscribe((data) => {
      this.line = data;
      this.lineForm.patchValue({ SerialNumber : data.SerialNumber })
      err => console.log(err);
    });
    this.http.getStations(this.selectedLine).subscribe((data) => {
      this.stations = data;
      this.selectedStation = this.stations[0];
      err => console.log(err);
    });
  }

  getSelectedStation(){
    this.http.getSelectedStation(this.selectedStation).subscribe((data) => {
      this.station = data;
      this.stationForm.patchValue({ Name : data.Name, Address : data.Address })
      err => console.log(err);
    });
  }

  deleteSelectedLine(){
    this.http.deleteSelectedLine(this.selectedLine).subscribe((data) => {
      if(data == "success")
      {
        // alert("Uspesno obrisana linija");
        // this.router.navigate(["/line"]);
        this.lines = this.lines.filter(x => x.toString() !== this.selectedLine);
      }
      else
      {
        alert("Vec postoji linija sa tim rednim brojem");
        this.router.navigate(["/line"]);
      }
      err => console.log(err);
    });
  }

  AddLine(){
    this.http.addLine(this.newLine).subscribe((data) => {
      if(data == "unsuccessfull")
      {
        alert("Error adding new line");
        this.router.navigate(["/line"]);
      }
      else{
        this.lines.push(this.newLine);
      }
      err => console.log(err);
    });
  }
}