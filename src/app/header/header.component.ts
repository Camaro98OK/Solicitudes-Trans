import { Component, OnInit, Input, HostListener } from '@angular/core';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() screenWith: number = 0;
  @Input() collapsed: boolean = false;

  canShowSearchAsOverlay = false;


  constructor() { }

  @HostListener('window:resize', ['$event']) onResize(event: any){
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  getHeadClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWith > 768){
      styleClass = 'head-trimmed';
    } else if(this.collapsed && (this.screenWith <= 768 && this.screenWith > 0)) {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearchAsOverlay(innrWidth: number): void {
    if(innerWidth < 845 ){
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false
    }

  }
}
