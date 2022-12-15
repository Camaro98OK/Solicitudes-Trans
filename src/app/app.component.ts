import { Component } from '@angular/core';

interface SideNavToggle{
  screenWith: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']})


export class AppComponent {
  title = 'sier2';
  isSideNavCollapsed = false;
  screenWith = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.isSideNavCollapsed = data.collapsed;
    this.screenWith = data.screenWith;
  }
}
