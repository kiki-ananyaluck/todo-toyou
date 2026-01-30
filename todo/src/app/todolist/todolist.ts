import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, SharedTableComponent],
  templateUrl: './todolist.html',
  styleUrl: './todolist.css',
  standalone: true,
})
export class Todolist {
    @ViewChild(SharedTableComponent) sharedTable!: SharedTableComponent<TodoItem>;

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

      onPageIndexChange(pageIndex: number): void {
        this.tableConfig.pageIndex = pageIndex;
      }

      onPageSizeChange(pageSize: number): void {
        this.tableConfig.pageSize = pageSize;
      }

      onCurrentPageDataChange(currentPageData: TodoItem[]): void {
        // Handle current page data change if needed
      }

      onItemChecked(event:any): void {
        // Handle item checked change if needed
      }

      onAllChecked(event:any): void {
        // Handle all checked change if needed
      }


}
