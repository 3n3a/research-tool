import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { menuItems } from '../../config/menu.config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pages-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {
  menuItems: MenuItem[] = menuItems;
}
