# Shared Table Component

Shared table component ที่สามารถใช้งานร่วมกันได้ทุกเพจ โดยรับ configuration ผ่าน input

## การใช้งาน

### 1. Import Component

```typescript
import { SharedTableComponent, TableConfig, TableColumnConfig } from '../components/shared-table';
```

### 2. เพิ่มใน Component imports

```typescript
@Component({
  selector: 'app-your-component',
  imports: [CommonModule, SharedTableComponent],
  // ...
})
```

### 3. สร้าง Configuration

```typescript
interface YourDataType {
  id: string;
  name: string;
  date: Date;
  active: boolean;
}

export class YourComponent {
  tableConfig: TableConfig<YourDataType> = {
    columns: [
      {
        label: 'ID',
        field: 'id',
        sortFn: (a, b) => a.id.localeCompare(b.id),
      },
      {
        label: 'Name',
        field: 'name',
        sortFn: (a, b) => a.name.localeCompare(b.name),
      },
      {
        label: 'Date',
        field: 'date',
        renderType: 'date',
        sortFn: (a, b) => a.date.getTime() - b.date.getTime(),
      },
      {
        label: 'Active',
        field: 'active',
        renderType: 'boolean-tag',
        filters: [
          { text: 'Active', value: true },
          { text: 'Inactive', value: false },
        ],
        filterFn: (list, item) => list.length > 0 ? list.includes(item.active) : true,
      },
    ],
    data: [], // ข้อมูลของคุณ
    loading: false,
    showCheckbox: true,
    showPagination: true,
    showSizeChanger: true,
    pageSize: 10,
    pageIndex: 1,
    total: 0,
  };
}
```

### 4. ใช้งานใน Template

```html
<app-shared-table 
  [config]="tableConfig"
  (pageIndexChange)="onPageIndexChange($event)"
  (pageSizeChange)="onPageSizeChange($event)"
  (currentPageDataChange)="onCurrentPageDataChange($event)"
  (itemChecked)="onItemChecked($event)"
  (allChecked)="onAllChecked($event)"
></app-shared-table>
```

## Configuration Options

### TableConfig Properties

- `columns`: Column configuration array
- `data`: Array ของข้อมูลที่จะแสดง
- `loading`: สถานะ loading
- `showCheckbox`: แสดง checkbox หรือไม่ (default: false)
- `showPagination`: แสดง pagination หรือไม่ (default: true)
- `showSizeChanger`: แสดง page size changer หรือไม่ (default: true)
- `pageSize`: จำนวนแถวต่อหน้า (default: 10)
- `pageIndex`: หน้าปัจจุบัน (default: 1)
- `total`: จำนวนข้อมูลทั้งหมด

### TableColumnConfig Properties

- `label`: ชื่อคอลัมน์
- `field`: ชื่อ field ในข้อมูล
- `renderType`: รูปแบบการแสดงผล ('text' | 'boolean-tag' | 'date')
- `filters`: Array ของ filter options
- `filterFn`: Function สำหรับ filter
- `sortFn`: Function สำหรับ sort

## Events

- `pageIndexChange`: เมื่อเปลี่ยนหน้า
- `pageSizeChange`: เมื่อเปลี่ยนขนาดหน้า
- `currentPageDataChange`: เมื่อข้อมูลหน้าปัจจุบันเปลี่ยน
- `itemChecked`: เมื่อเลือกหรือยกเลิกการเลือก item
- `allChecked`: เมื่อเลือกหรือยกเลิกการเลือกทั้งหมด

## Methods

สามารถเข้าถึง methods ของ component ได้ผ่าน ViewChild:

```typescript
@ViewChild(SharedTableComponent) sharedTable!: SharedTableComponent;

// รายการที่เลือก
getSelected(): any[] {
  return this.sharedTable.getSelectedItems();
}

// ล้างการเลือก
clearSelection(): void {
  this.sharedTable.clearSelection();
}
```

## Render Types

### text (default)
แสดงข้อความปกติ

### boolean-tag
แสดง boolean value เป็น tag สีเขียว (true) หรือสีแดง (false)

### date
แสดงวันที่ในรูปแบบ date pipe (short format)

## ตัวอย่างการใช้งานเพิ่มเติม

### การ Filter แบบ Custom

```typescript
{
  label: 'Status',
  field: 'status',
  filters: [
    { text: 'Active', value: 'active' },
    { text: 'Pending', value: 'pending' },
    { text: 'Inactive', value: 'inactive' },
  ],
  filterFn: (statusList, item) => {
    return statusList.length > 0 ? statusList.includes(item.status) : true;
  },
}
```

### การ Sort แบบ Custom

```typescript
{
  label: 'Priority',
  field: 'priority',
  sortFn: (a, b) => {
    const priorities = { high: 3, medium: 2, low: 1 };
    return priorities[b.priority] - priorities[a.priority];
  },
}
```