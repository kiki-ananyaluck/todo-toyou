import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TodoDto {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  type: string;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  result: T;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todos`;
  private mockApiUrl = 'https://696ddfbdd7bacd2dd714d27b.mockapi.io/todo';

  constructor(private http: HttpClient) {}

  getMockupTodos(): Observable<TodoDto[]> {
    return this.http.get<TodoDto[]>(this.mockApiUrl);
  }
  /**
   * Get all todos with pagination
   */
  getAllTodos(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedResult<TodoDto>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResult<TodoDto>>>(this.apiUrl, { params });
  }

  /**
   * Get paginated todos
   */
  getPaginatedTodos(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedResult<TodoDto>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResult<TodoDto>>>(`${this.apiUrl}/paginated`, { params });
  }

  /**
   * Get a single todo by ID
   */
  getTodoById(id: number): Observable<TodoDto> {
    return this.http.get<TodoDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new todo
   */
  createTodo(todo: Partial<TodoDto>): Observable<ApiResponse<TodoDto>> {
    return this.http.post<ApiResponse<TodoDto>>(this.apiUrl, todo);
  }

  /**
   * Update an existing todo
   */
  updateTodo(id: number, todo: TodoDto): Observable<TodoDto> {
    return this.http.put<TodoDto>(`${this.apiUrl}/${id}`, todo);
  }

  /**
   * Delete a todo
   */
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
