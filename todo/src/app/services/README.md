// filepath: /Users/kiki/Desktop/todo-toyou/todo/src/app/services/README.md
# Todo Service

## การใช้งาน Todo Service

Service นี้ใช้สำหรับเรียก API จาก backend todo application

### API Endpoints

- **GET** `/api/todos` - ดึงข้อมูล todos ทั้งหมด
- **GET** `/api/todos/paginated` - ดึงข้อมูล todos แบบแบ่งหน้า
- **GET** `/api/todos/{id}` - ดึงข้อมูล todo ตาม id
- **POST** `/api/todos` - สร้าง todo ใหม่
- **PUT** `/api/todos/{id}` - แก้ไข todo
- **DELETE** `/api/todos/{id}` - ลบ todo

### ตัวอย่างการใช้งาน

#### 1. Inject Service ใน Component

```typescript
import { Component, OnInit } from '@angular/core';
import { TodoService, TodoDto } from '../services/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [/* your imports */],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo implements OnInit {
  todos: TodoDto[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getAllTodos().subscribe({
      next: (data) => {
        this.todos = data;
        console.log('Todos loaded:', data);
      },
      error: (error) => {
        console.error('Error loading todos:', error);
      }
    });
  }
}
```

#### 2. สร้าง Todo ใหม่

```typescript
createNewTodo() {
  const newTodo: TodoDto = {
    title: 'Buy groceries',
    dueDate: '2026-01-29T17:51:08.843Z',
    type: 'Personal'
  };

  this.todoService.createTodo(newTodo).subscribe({
    next: (created) => {
      console.log('Todo created:', created);
      this.loadTodos(); // โหลดข้อมูลใหม่
    },
    error: (error) => {
      console.error('Error creating todo:', error);
    }
  });
}
```

#### 3. ดึงข้อมูลแบบแบ่งหน้า (Pagination)

```typescript
loadPaginatedTodos(page: number = 1, size: number = 10) {
  this.todoService.getPaginatedTodos(page, size).subscribe({
    next: (result) => {
      this.todos = result.items;
      console.log('Total pages:', result.totalPages);
      console.log('Total items:', result.totalCount);
    },
    error: (error) => {
      console.error('Error loading paginated todos:', error);
    }
  });
}
```

#### 4. แก้ไข Todo

```typescript
updateTodo(id: number) {
  const updatedTodo: TodoDto = {
    title: 'Updated title',
    dueDate: '2026-01-30T10:00:00.000Z',
    type: 'Work'
  };

  this.todoService.updateTodo(id, updatedTodo).subscribe({
    next: (updated) => {
      console.log('Todo updated:', updated);
      this.loadTodos();
    },
    error: (error) => {
      console.error('Error updating todo:', error);
    }
  });
}
```

#### 5. ลบ Todo

```typescript
deleteTodo(id: number) {
  this.todoService.deleteTodo(id).subscribe({
    next: () => {
      console.log('Todo deleted successfully');
      this.loadTodos();
    },
    error: (error) => {
      console.error('Error deleting todo:', error);
    }
  });
}
```

### การตั้งค่า Environment

ไฟล์ `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5245/api'
};
```

### โครงสร้าง TodoDto

```typescript
interface TodoDto {
  id?: number;           // Optional เพราะเวลาสร้างใหม่จะไม่มี id
  title: string;         // ชื่อ todo
  dueDate: string;       // วันที่ครบกำหนด (ISO string format)
  type: string;          // ประเภท todo (Personal, Work, etc.)
}
```

### การจัดการ Error

แนะนำให้สร้าง Error Handler Service หรือใช้ try-catch เพื่อจัดการ error ที่อาจเกิดขึ้น:

```typescript
loadTodos() {
  this.todoService.getAllTodos().subscribe({
    next: (data) => {
      this.todos = data;
    },
    error: (error) => {
      if (error.status === 404) {
        console.error('API endpoint not found');
      } else if (error.status === 500) {
        console.error('Server error');
      } else {
        console.error('Unexpected error:', error);
      }
    }
  });
}
```
