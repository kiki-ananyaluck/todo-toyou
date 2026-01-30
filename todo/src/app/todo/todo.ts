import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AddTodo } from '../components/modal/add-todo/add-todo';
import { TodoService } from '../services/todo.service';

interface TodoItem {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  type: string;
  createdAt?: Date;
}

interface ColumnConfig {
  label: string;
  field: keyof TodoItem;
  renderType?: 'text' | 'boolean-tag' | 'date';
  filters?: NzTableFilterList;
  filterFn?: NzTableFilterFn<TodoItem>;
  sortFn?: ((a: TodoItem, b: TodoItem) => number) | null;
}

@Component({
  selector: 'app-todo',
  imports: [CommonModule, NzButtonModule, NzTableModule, NzTagModule, NzModalModule, DatePipe],
  standalone: true,
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo implements OnInit {
  constructor(
    private modal: NzModalService,
    private todoService: TodoService,
    private cdr: ChangeDetectorRef,
  ) {}

  columns: ColumnConfig[] = [
    {
      label: 'ID',
      field: 'id',
      sortFn: (a: TodoItem, b: TodoItem) => a.id.localeCompare(b.id),
    },
    {
      label: 'Title',
      field: 'title',
      sortFn: (a: TodoItem, b: TodoItem) => a.title.localeCompare(b.title),
    },
    {
      label: 'Due Date',
      field: 'dueDate',
      renderType: 'date',
      sortFn: (a: TodoItem, b: TodoItem) => a.dueDate.getTime() - b.dueDate.getTime(),
    },
    {
      label: 'Completed',
      field: 'completed',
      renderType: 'boolean-tag',
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      filterFn: (list: boolean[], item: TodoItem) =>
        list.length > 0 ? list.some((completed) => item.completed === completed) : true,
    },
    {
      label: 'Type',
      field: 'type',
      sortFn: (a: TodoItem, b: TodoItem) => a.type.localeCompare(b.type),
    },
  ];

  dataTodoTable: TodoItem[] = [];

  // Pagination
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  loading = false;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  ngOnInit(): void {
    // this.loadTodos();
    this.loadMockupTodos();
  }

  loadMockupTodos(): void {
    if (this.loading) {
      console.log('กำลังโหลดอยู่แล้ว ขามการโหลดใหม่');
      return;
    }

    console.log('loading', this.loading);
    this.loading = true;
    this.cdr.detectChanges();
    
    this.todoService.getMockupTodos().subscribe({
      next: (todos) => {
        this.dataTodoTable = todos.map((todo: any) => ({
          id: todo.id,
          title: todo.title,
          dueDate: new Date(todo.dueDate),
          completed: todo.completed ?? false, 
          type: todo.type,
          createdAt: new Date(todo.createdAt),
        }));
        this.total = todos.length;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('loading', this.loading);
        console.log('Mockup Todos loaded:', this.dataTodoTable);
      },
      error: (error) => {
        console.error('Error loading mockup todos:', error);
        this.loading = false;
        this.cdr.detectChanges();
        // ถ้า API ไม่ทำงาน ใช้ข้อมูลจำลอง
        this.loadFallbackData();
      },
    });
  }

  loadFallbackData(): void {
    // ข้อมูลจำลองสำหรับกรณี API ไม่ทำงาน
    this.dataTodoTable = [
      {
        id: '1',
        title: 'Sample Todo 1',
        dueDate: new Date('2026-02-15'),
        completed: false,
        type: 'Work',
        createdAt: new Date('2026-01-30'),
      },
      {
        id: '2',
        title: 'Sample Todo 2',
        dueDate: new Date('2026-02-20'),
        completed: true,
        type: 'Personal',
        createdAt: new Date('2026-01-29'),
      },
      {
        id: '3',
        title: 'Sample Todo 3',
        dueDate: new Date('2026-02-25'),
        completed: false,
        type: 'Work',
        createdAt: new Date('2026-01-28'),
      },
    ];
    this.total = this.dataTodoTable.length;
    console.log('Fallback data loaded:', this.dataTodoTable);
  }

  loadTodos(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    this.loading = true;
    this.todoService.getPaginatedTodos(pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataTodoTable = response.result.items.map((todo: any) => ({
          id: todo.id,
          title: todo.title,
          dueDate: new Date(todo.dueDate),
          completed: todo.isCompleted ?? false,
          type: todo.type,
          createdAt: new Date(todo.createdAt),
        }));
        this.total = response.result.totalCount;
        this.pageIndex = response.result.pageNumber;
        this.pageSize = response.result.pageSize;
        // this.loading = false;
        console.log('Todos loaded:', this.dataTodoTable);
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.loading = false;
      },
    });
  }

  onPageIndexChange(pageIndex: number): void {
    this.loadTodos(pageIndex, this.pageSize);
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.loadTodos(1, pageSize);
  }

  onCurrentPageDataChange(): void {
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.dataTodoTable
      .filter((item) => !item.completed)
      .forEach(({ id }) => {
        if (id !== undefined) {
          if (checked) {
            this.setOfCheckedId.add(id);
          } else {
            this.setOfCheckedId.delete(id);
          }
        }
      });
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    console.log(id, checked);
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.dataTodoTable.filter((item) => !item.completed);
    this.checked = listOfEnabledData.every(
      (item) => item.id !== undefined && this.setOfCheckedId.has(item.id),
    );
    this.indeterminate =
      listOfEnabledData.some((item) => item.id !== undefined && this.setOfCheckedId.has(item.id)) &&
      !this.checked;
  }

  addTodo(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Add New Todo',
      nzContent: AddTodo,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => modalRef.destroy(),
        },
        {
          label: 'Add',
          type: 'primary',
          onClick: (componentInstance) => {
            if (!componentInstance?.isValid()) {
              return;
            }

            const newTodo = {
              title: componentInstance?.title || 'New Todo',
              dueDate: componentInstance?.dueDate
                ? new Date(componentInstance.dueDate).toISOString()
                : new Date().toISOString(),
              type: componentInstance?.type || 'Personal',
            };

            this.todoService.createTodo(newTodo).subscribe({
              next: (response) => {
                // Reload the current page to fetch updated data
                this.loadTodos(this.pageIndex, this.pageSize);
                modalRef.destroy();
              },
              error: (error) => {
                console.error('Error creating todo:', error);
                // You can add error notification here
              },
            });
          },
        },
      ],
    });
  }

  clearCompleted(): void {
    this.dataTodoTable = this.dataTodoTable.filter((item) => !item.completed);
    this.setOfCheckedId.clear();
    this.refreshCheckedStatus();
  }

  see(): void {
    console.log('test');
  }
}
