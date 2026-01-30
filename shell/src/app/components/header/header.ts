import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-header',
  imports: [RouterModule, NzIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  isMobileMenuOpen = false;
  isDashboardDropdownOpen = false;

  linkList: Array<{ id: number; link: string; name: string; submenu?: Array<{ id: number; link: string; name: string }> }> = [
    { id: 1 ,link: '/', name: 'Home' },
    { id: 2, link: '/todo', name: 'Todo' },
    { 
      id: 4, 
      link: '/dashboard', 
      name: 'Dashboard',
      submenu: [
        { id: 41, link: '/dashboard/weekly', name: 'Weekly View' },
        { id: 42, link: '/dashboard/all', name: 'All Tasks' }
      ]
    },
    { id: 5, link: '/contact', name: 'Contact' },
  ];

  iconList: Array<{ id: number; link: string; icon: string }> = [
    { id: 1, link: '#', icon: 'github' },
    { id: 2, link: '#', icon: 'twitter' }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleDashboardDropdown() {
    this.isDashboardDropdownOpen = !this.isDashboardDropdownOpen;
  }

  closeDashboardDropdown() {
    this.isDashboardDropdownOpen = false;
  }

}