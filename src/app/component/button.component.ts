import {Component, Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {} from '../extensions/app.global'

/**
 * @title Basic buttons
 */
@Component({
  selector: 'sm-esports-button',
  imports: [
    RouterLinkActive,
    RouterLink,
    NgClass
  ],
  templateUrl: './template/button.component.html'
})
export class BasicButtonComponent {

  private readonly router: Router;

  // Provides [textValue]
  @Input() text!: string;

  // Provides [route]
  @Input() route!: string;

  // Provides [disabled]
  @Input() disabled!: boolean;

  // Provides (clicked)
  @Output('clicked') clicked = new EventEmitter<string>();

  constructor(router: Router) {
    this.disabled = false;
    this.text = 'Button';
    this.route = '';
    this.router = router;
  }

  ngOnInit()  {
    this.routeActive();
  }

  onClick() {

    if (!this.routeActive()) {
      this.clicked.emit(this.route);
    }
  }

  routeActive() {

    if (this.route)
      return this.stringContains(this.router.url, this.route);

    return false;
  }

  stringContains(parent:string, substring:string){

    for (let i = 0; i < parent.length; i++) {

      let j:number = 0;

      // Iterate until substring is exhausted
      while (j < substring.length &&
      i + j < parent.length &&
      parent[i + j] == substring[j++]) {
      }

      // Success
      if (j == substring.length) {
        return true;
      }
    }

    return false;
  }
}
