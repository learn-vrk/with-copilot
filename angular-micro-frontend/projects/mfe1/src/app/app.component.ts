import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>MFE1 Standalone</h1>
    <router-outlet></router-outlet>
  `,
  styles: [`
    h1 {
      color: #e74c3c;
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'mfe1';
}
