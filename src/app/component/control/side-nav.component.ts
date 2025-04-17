import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {FileService} from '../../service/file.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {faCircle, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {ClickOutsideDirective} from '../../directive/click-outside.directive';

@Component({
  selector: 'sm-esports-sidenav',
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,
    FaIconComponent,
    NgClass,
    ClickOutsideDirective,
    NgIf
  ],
  templateUrl: '../template/control/side-nav.component.html'
})
export class SideNavComponent {

  @Input('side-nav-show') showSideNav!:boolean;
  @Output() showSideNavChange = new EventEmitter<boolean>();

  protected showHomeNavTree:boolean = false;
  protected showPeopleNavTree:boolean = false;
  protected showCollabNavTree:boolean = false;
  protected showLandscapeNavTree:boolean = false;
  protected showChatNavTree:boolean = false;

  protected readonly faCircle = faCircle;
  protected readonly faGithub = faGithub;
  protected readonly faEnvelope = faEnvelope;

  constructor(private readonly router:Router) {
  }

  onOffClick(){
    this.showSideNav = false;
    this.showSideNavChange.emit(this.showSideNav);
  }

  onClicked() {
    this.showSideNav = false;
    this.showSideNavChange.emit(this.showSideNav);
  }

  onLoginClicked() {

    // Collapse side-nav
    this.showSideNav = false;
    this.showSideNavChange.emit(this.showSideNav);

    // Route to login (should be user dropdown)
    setTimeout(() => {
      this.router.navigate(['/login']);
    });
  }
}
