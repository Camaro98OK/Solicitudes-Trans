import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  @Input() screenWith: number = 0;
  @Input() collapsed: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    this.getBodyClass();
  }

  getBodyClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWith > 768){
      styleClass = 'body-trimmed';
    } else if(this.collapsed && (this.screenWith <= 768 && this.screenWith > 0)) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
}
