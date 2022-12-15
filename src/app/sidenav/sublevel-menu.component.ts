import { Component, Input, OnInit } from '@angular/core';
import { INAvbarData } from './helper';
import { trigger, transition, style, state, animate } from '@angular/animations'
import { Router } from '@angular/router';


@Component({
  selector: 'app-sublevel-menu',
  template: `
    <ul *ngIf="collapsed && data.items && data.items.length > 0"
      [@submenu] = "expanded
                      ? {value: 'visible', params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', heigth: '*'}}
                      : {value: 'hidden',  params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', heigth: '0'}} "
      class="sublevel-nav">
      <li *ngFor="let item of data.items" class="sublevel-nav-item">
          <a class="sublevel-nav-link" (click)="handleClick(item)"
            *ngIf="item.items && item.items.length > 0"
            [ngClass]="getActiveClass(item)">
              <i class="sublevel-link-icon fa fa-cicle"></i>
              <span class="sublevel-link-text" *ngIf="collapsed">{{item.label}}</span>
              <i class="menu-collapse-icon" *ngIf="item.items && collapsed"
                 [ngClass]="!item.expanded ? 'fa-solid fa-circle-up' : 'fa-solid fa-circle-down'">
              </i>
          </a>
          <a class="sublevel-nav-link"
            *ngIf="!item.items || (item.items && item.items.length === 0)"
              [routerLink]="[item.routelink]"
              routerLinkActive="active-sublevel"
              [routerLinkActiveOptions]="{exact: true}"
          >
          <i class="sublevel-link-icon" fa.fa-circule></i>
              <span class="sublevel-link-text" *ngIf="collapsed">{{item.label}}</span>
          </a>
          <div *ngIf="item.items && item.items.length > 0">
            <app-sublevel-menu
              [data]="item"
              [collapsed]="collapsed"
              [multiple]="multiple"
              [expanded]="item.expanded">
            </app-sublevel-menu>
          </div>
      </li>
  </ul>
  `,
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('submenu', [
      state('hidden', style({height: '0',overflow: 'hidden'})),
      state('visible', style({height: '*'})),
      transition('visible <=> hidden', [style({overflow: 'hidden'}),
      animate('{{transitionParams}}')]),
      transition('void => *', animate(0))
    ])
  ]
})
export class SublevelMenuComponent implements OnInit {

@Input() data: INAvbarData = {
  routelink: '',
  icon: '',
  label: '',
  items: []
}

@Input() collapsed = false;
@Input() animating: boolean | undefined;
@Input() expanded: boolean | undefined;
@Input() multiple: boolean = false;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  handleClick(item:any): void {
    if(!this.multiple) {
      if(this.data.items && this.data.items.length > 0) {
        for(let modelItem of this.data.items){
          if (item !== modelItem && modelItem.expanded){
            modelItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;
  }

  getActiveClass(item: INAvbarData): string {
    return item.expanded && this.router.url.includes(item.routelink) ? 'active-sublevel' : ''
  }

}
