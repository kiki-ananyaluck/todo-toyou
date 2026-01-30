import { Routes } from '@angular/router';
import { Todo } from './todo/todo';
import { Todolist } from './todolist/todolist';

export const remoteRoutes: Routes = [
  {
    path: '',
    component: Todo,
  },
  {
    path: 'todo-list',
    component: Todolist,
  }
];