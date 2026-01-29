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

  linkList: Array<{ id: number; link: string; name: string }> = [
    { id: 1 ,link: '/', name: 'Home' },
    { id: 2, link: '/todo', name: 'Todo' },
    { id: 3, link: '/about', name: 'About' },
    { id: 4, link: '/contact', name: 'Contact' },
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

}