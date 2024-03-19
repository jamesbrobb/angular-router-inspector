import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from "@angular/router";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-route',
  standalone: true,
    imports: [
        RouterOutlet,
        MatCheckbox
    ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss'
})
export class RouteComponent {
  readonly activatedRoute = inject(ActivatedRoute);

  allowDeactivation = true;
  constructor(route: ActivatedRoute) {
    this.activatedRoute = route;
  }
}
