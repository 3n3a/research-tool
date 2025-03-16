import { MenuItem } from "primeng/api";

export const menuItems: MenuItem[] = [
  {
    label: 'Home',
    icon: 'pi pi-fw pi-home',
    routerLink: '/app/home'
  },
  {
    label: 'DNS',
    icon: 'pi pi-fw pi-file',
    routerLink: '/app/dns'
  },
  {
    label: 'Subdomains',
    icon: 'pi pi-fw pi-list-check',
    routerLink: '/app/subdomains'
  },
  {
    label: 'IP-Adresses',
    icon: 'pi pi-fw pi-map-marker',
    routerLink: '/app/ip'
  }
]
