import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  NzTableFilterFn,
  NzTableFilterList,
} from 'ng-zorro-antd/table';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AddTodo } from '../components/modal/add-todo/add-todo';
import { TodoService } from '../services/todo.service';
import { SharedTableComponent, TableConfig, TableColumnConfig } from '../components/shared-table';

interface TodoItem {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  type: string;
  createdAt?: Date;
}

@Component({
  selector: 'app-todolist',
  imports: [CommonModule, NzButtonModule, NzModalModule, DatePipe, SharedTableComponent],
  templateUrl: './todolist.html',
  styleUrl: './todolist.css',
  standalone: true,
})
export class Todolist {

 @ViewChild(SharedTableComponent) sharedTable!: SharedTableComponent<TodoItem>;
  
  constructor(
    private modal: NzModalService,
    private todoService: TodoService,
    private cdr: ChangeDetectorRef,
  ) {}

  tableConfig: TableConfig<TodoItem> = {
    columns: [
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
    ],
    data: [],
    loading: false,
    showCheckbox: true,
    showPagination: true,
    showSizeChanger: true,
    pageSize: 10,
    pageIndex: 1,
    total: 0,
  };

  ngOnInit(): void {
    // this.loadTodos();
    this.loadMockupTodos();
  }

  loadMockupTodos(): void {
    if (this.tableConfig.loading) {
      console.log('กำลังโหลดอยู่แล้ว ขามการโหลดใหม่');
      return;
    }

    console.log('loading', this.tableConfig.loading);
    this.tableConfig.loading = true;
    this.cdr.detectChanges();
    
    this.todoService.getMockupTodos().subscribe({
      next: (todos) => {
        const todoData: TodoItem[] = todos.map((todo: any) => ({
          id: todo.id,
          title: todo.title,
          dueDate: new Date(todo.dueDate),
          completed: todo.completed ?? false, 
          type: todo.type,
          createdAt: new Date(todo.createdAt),
        }));
        this.tableConfig.data = todoData;
        this.tableConfig.total = todos.length;
        this.tableConfig.loading = false;
        this.cdr.detectChanges();
        console.log('loading', this.tableConfig.loading);
        console.log('Mockup Todos loaded:', todoData);
      },
      error: (error) => {
        console.error('Error loading mockup todos:', error);
        this.tableConfig.loading = false;
        this.cdr.detectChanges();
        // ถ้า API ไม่ทำงาน ใช้ข้อมูลจำลอง
        this.loadFallbackData();
      },
    });
  }

  loadFallbackData(): void {
    // ข้อมูลจำลองสำหรับกรณี API ไม่ทำงาน
    const mockData: TodoItem[] = [
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
    this.tableConfig.data = mockData;
    this.tableConfig.total = mockData.length;
    console.log('Fallback data loaded:', mockData);
  }

  loadTodos(pageIndex: number = 1, pageSize: number = 10): void {
    this.tableConfig.loading = true;
    this.todoService.getPaginatedTodos(pageIndex, pageSize).subscribe({
      next: (response) => {
        const todoData: TodoItem[] = response.result.items.map((todo: any) => ({
          id: todo.id,
          title: todo.title,
          dueDate: new Date(todo.dueDate),
          completed: todo.isCompleted ?? false,
          type: todo.type,
          createdAt: new Date(todo.createdAt),
        }));
        
        this.tableConfig.data = todoData;
        this.tableConfig.total = response.result.totalCount;
        this.tableConfig.pageIndex = response.result.pageNumber;
        this.tableConfig.pageSize = response.result.pageSize;
        this.tableConfig.loading = false;
        console.log('Todos loaded:', todoData);
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.tableConfig.loading = false;
      },
    });
  }

  onPageIndexChange(pageIndex: number): void {
    this.tableConfig.pageIndex = pageIndex;
    this.loadTodos(pageIndex, this.tableConfig.pageSize!);
  }

  onPageSizeChange(pageSize: number): void {
    this.tableConfig.pageSize = pageSize;
    this.tableConfig.pageIndex = 1;
    this.loadTodos(1, pageSize);
  }

  onCurrentPageDataChange(currentPageData: TodoItem[]): void {
    // Additional logic if needed
  }

  onItemChecked(event: { id: string; checked: boolean }): void {
    console.log('Item checked:', event.id, event.checked);
    // Additional logic if needed
  }

  onAllChecked(checked: boolean): void {
    console.log('All checked:', checked);
    // Additional logic if needed
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
                this.loadTodos(this.tableConfig.pageIndex!, this.tableConfig.pageSize!);
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
    const selectedItems = this.sharedTable?.getSelectedItems() || [];
    console.log('Selected items to clear:', selectedItems);
    
    // Remove completed items from the table data
    this.tableConfig.data = this.tableConfig.data.filter((item) => !item.completed);
    this.tableConfig.total = this.tableConfig.data.length;
    
    // Clear selections
    this.sharedTable?.clearSelection();
  }

  see(): void {
    console.log('test');
  }

}
