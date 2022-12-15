import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { navbarData } from './nav-data'
import { trigger, transition, animate, keyframes, style } from '@angular/animations'
import { INAvbarData } from './helper';
import { Router } from '@angular/router';

interface SideNavToggle{
  screenWith: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [trigger('rotate', [
    transition(':enter', [animate('1000ms',
                          keyframes([style({transform: 'rotate(0deg)', offset:'0'}),
                                     style({transform: 'rotate(2turn)', offset:'1'})
                                   ])
                          )]
                    )]
          )
  ],
})

export class SidenavComponent implements OnInit {
  collapsed = false;
  screenWith = 0;
  navData = navbarData;
  multiple: boolean = false;


  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWith = window.innerWidth;
    if(this.screenWith <= 768){
      this.collapsed = false
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWith: this.screenWith});
    } else {
      this.collapsed = true;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWith: this.screenWith});
    }
  }

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.screenWith = window.innerWidth;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWith: this.screenWith});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWith: this.screenWith});
  }

  handleClick(item: INAvbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(i: INAvbarData): string {
    return this.router.url.includes(i.routelink) ? 'active' : '';
  }

  shrinkItems(item: INAvbarData): void{
    if(!this.multiple) {
      for(let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }
}
