import { Component } from '@angular/core';
import { versions } from '../../../environments/versions';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true,
  imports: []
})
export class AboutComponent {
  version = versions.version;
  revision = versions.revision;
  branch = versions.branch;
  env = environment.env;

  width = window.innerWidth;
  height = window.innerHeight;
}
