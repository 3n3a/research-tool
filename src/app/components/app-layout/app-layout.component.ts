import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { menuItems } from '../../config/menu.config';
import { MenuItem } from 'primeng/api';
import { AppTopBarComponent } from "../app-top-bar/app-top-bar.component";

@Component({
  selector: 'comp-app-layout',
  imports: [RouterOutlet, AppTopBarComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {
  menuItems: MenuItem[] = menuItems;
}
