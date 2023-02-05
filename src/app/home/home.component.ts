import { Component } from '@angular/core';
import { versions } from '../../environments/versions';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  version = versions.version;
  revision = versions.revision;
  branch = versions.branch;
  env = environment.env;

}
