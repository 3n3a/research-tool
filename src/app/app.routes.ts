import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/app/home',
        pathMatch: 'full'
    },
    {
      path: 'app',
      component: AppLayoutComponent,
      children: [
        {
          path: 'home',
          loadComponent: () => import('./pages/home/home.component')
            .then(c => c.HomeComponent)
        },
        {
          path: 'dns',
          loadComponent: () => import('./pages/dns/dns.component')
            .then(c => c.DnsComponent)
        },
        {
          path: 'subdomains',
          loadComponent: () => import('./pages/subdomains/subdomains.component')
            .then(c => c.SubdomainsComponent)
        },
        {
          path: 'ip',
          loadComponent: () => import('./pages/ip/ip.component')
            .then(c => c.IpComponent)
        }
      ]
    }
];
