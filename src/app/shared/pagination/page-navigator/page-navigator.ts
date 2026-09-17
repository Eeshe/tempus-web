import { Component, input, output } from '@angular/core';
import { Page } from '../../models/page.model';

@Component({
  imports: [],
  selector: 'app-page-navigator',
  styleUrl: './page-navigator.css',
  templateUrl: './page-navigator.html',
})
export class PageNavigator {
  readonly page = input.required<Page>();

  readonly previousPageEvent = output<void>();
  readonly nextPageEvent = output<void>();
}
