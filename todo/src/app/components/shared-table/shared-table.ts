import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
} from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

export interface TableColumnConfig<T = any> {
  label: string;
  field: keyof T;
  renderType?: 'text' | 'boolean-tag' | 'date';
  filters?: NzTableFilterList;
  filterFn?: NzTableFilterFn<T>;
  sortFn?: ((a: T, b: T) => number) | null;
}

export interface TableConfig<T = any> {
  columns: TableColumnConfig<T>[];
  data: T[];
  loading?: boolean;
  showCheckbox?: boolean;
  showPagination?: boolean;
  showSizeChanger?: boolean;
  pageSize?: number;
  pageIndex?: number;
  total?: number;
}

@Component({
  selector: 'app-shared-table',
  imports: [CommonModule, NzTableModule, NzTagModule, DatePipe],
  standalone: true,
  template: `
    <nz-table
      #rowSelectionTable
      [nzShowPagination]="config.showPagination ?? true"
      [nzShowSizeChanger]="config.showSizeChanger ?? true"
      [nzData]="config.data"
      [nzLoading]="config.loading ?? false"
      [nzTotal]="config.total ?? config.data.length"
      [nzPageSize]="config.pageSize ?? 10"
      [nzPageIndex]="config.pageIndex ?? 1"
      (nzPageIndexChange)="onPageIndexChange($event)"
      (nzPageSizeChange)="onPageSizeChange($event)"
    >
      <thead>
        <tr>
          @if (config.showCheckbox) {
            <th
              nzLabel="Select all"
              [nzChecked]="checked"
              [nzIndeterminate]="indeterminate"
              (nzCheckedChange)="onAllChecked($event)"
            ></th>
          }
          @for (col of config.columns; track col.label) {
            @if (col.filters && col.filterFn) {
              <th [nzFilters]="col.filters" [nzFilterFn]="col.filterFn">{{ col.label }}</th>
            } @else if (col.sortFn) {
              <th [nzSortFn]="col.sortFn">{{ col.label }}</th>
            } @else {
              <th>{{ col.label }}</th>
            }
          }
        </tr>
      </thead>
      <tbody>
        @for (data of config.data; track getItemId(data) || $index) {
          <tr>
            @if (config.showCheckbox) {
              <td nzShowCheckbox 
                  [nzChecked]="setOfCheckedId.has(getItemId(data))" 
                  (nzCheckedChange)="onItemChecked(getItemId(data), $event)">
              </td>
            }
            @for (col of config.columns; track col.label) {
              <td>
                @switch (col.renderType) {
                  @case ('boolean-tag') {
                    <nz-tag [nzColor]="data[col.field] ? 'green' : 'red'">
                      {{ data[col.field] ? 'Yes' : 'No' }}
                    </nz-tag>
                  }
                  @case ('date') {
                    {{ data[col.field] }}
                  }
                  @default {
                    {{ data[col.field] }}
                  }
                }
              </td>
            }
          </tr>
        }
      </tbody>
    </nz-table>
  `
})
export class SharedTableComponent<T = any> implements OnInit, OnChanges {
  @Input() config!: TableConfig<T>;
  @Input() idField: keyof T = 'id' as keyof T;
  
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() currentPageDataChange = new EventEmitter<T[]>();
  @Output() itemChecked = new EventEmitter<{ id: any; checked: boolean }>();
  @Output() allChecked = new EventEmitter<boolean>();

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<any>();

  ngOnInit(): void {
    this.updateCheckedStatus();
  }

  ngOnChanges(): void {
    this.updateCheckedStatus();
  }

  getItemId(item: T): any {
    return item[this.idField];
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndexChange.emit(pageIndex);
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }

  onCurrentPageDataChange(currentPageData: T[]): void {
    this.currentPageDataChange.emit(currentPageData);
    this.updateCheckedStatus();
  }

  onItemChecked(id: any, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    this.updateCheckedStatus();
    this.itemChecked.emit({ id, checked });
  }

  onAllChecked(checked: boolean): void {
    if (checked) {
      this.config.data.forEach(item => this.setOfCheckedId.add(this.getItemId(item)));
    } else {
      this.setOfCheckedId.clear();
    }
    this.updateCheckedStatus();
    this.allChecked.emit(checked);
  }

  updateCheckedStatus(): void {
    const currentPageData = this.config.data || [];
    this.checked = currentPageData.length > 0 && currentPageData.every(item => this.setOfCheckedId.has(this.getItemId(item)));
    this.indeterminate = currentPageData.some(item => this.setOfCheckedId.has(this.getItemId(item))) && !this.checked;
  }

  getSelectedItems(): T[] {
    return this.config.data.filter(item => this.setOfCheckedId.has(this.getItemId(item)));
  }

  clearSelection(): void {
    this.setOfCheckedId.clear();
    this.updateCheckedStatus();
  }
}