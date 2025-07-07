import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectMessage, selectLoading, selectError } from './store/app.selectors';
import * as AppActions from './store/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Shell Application';
  message$: Observable<string>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.message$ = this.store.select(selectMessage);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit() {
    this.store.dispatch(AppActions.loadMessage());
  }

  updateMessage(newMessage: string) {
    this.store.dispatch(AppActions.updateMessage({ message: newMessage }));
  }

  loadMessage() {
    this.store.dispatch(AppActions.loadMessage());
  }

  isHomePage(): boolean {
    return this.router.url === '/';
  }
}
