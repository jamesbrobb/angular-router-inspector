import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from "@angular/router";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-loaded-child',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCheckbox
  ],
  templateUrl: './loaded-child.component.html',
  styleUrl: './loaded-child.component.scss'
})
export class LoadedChildComponent {
  readonly activatedRoute = inject(ActivatedRoute);

  allowDeactivation = true;
  constructor(route: ActivatedRoute) {
    this.activatedRoute = route;
  }
}
