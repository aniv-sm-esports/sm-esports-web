import {Component} from '@angular/core';
import { AppService } from '../service/app.service';
import {ReactiveFormsModule} from '@angular/forms';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {faBars, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: "contact",
  templateUrl: "./template/contact.component.html",
  imports: [
    ReactiveFormsModule,
    FaIconComponent
  ]
})
export class ContactComponent {

  protected faGithub =  faGithub;
  protected faEnvelope =  faEnvelope;

  constructor(protected readonly appService: AppService) {

  }

  protected readonly faBars = faBars;
}
