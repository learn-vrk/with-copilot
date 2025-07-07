import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-remote-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class RemoteEntryComponent implements OnInit {
  title = 'Micro Frontend 1';
  
  constructor() { }

  ngOnInit(): void {
    console.log('MFE1 Component initialized');
  }

  sendMessage() {
    console.log('Message sent from MFE1');
  }
}
