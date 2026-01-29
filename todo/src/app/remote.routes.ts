import { Routes } from '@angular/router';
import { Todo } from './todo/todo';

export const remoteRoutes: Routes = [
  {
    path: '',
    component: Todo,
  },
];