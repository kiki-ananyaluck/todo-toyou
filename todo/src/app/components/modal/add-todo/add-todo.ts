import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-add-todo',
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzDatePickerModule, NzSelectModule],
  standalone: true,
  templateUrl: './add-todo.html',
  styleUrl: './add-todo.css',
})
export class AddTodo implements OnInit {
  todoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      dueDate: [new Date(), [Validators.required]],
      type: ['Personal', [Validators.required]]
    });
  }

  get title() {
    return this.todoForm.get('title')?.value;
  }

  get dueDate() {
    return this.todoForm.get('dueDate')?.value;
  }

  get type() {
    return this.todoForm.get('type')?.value;
  }

  isValid(): boolean {
    return this.todoForm.valid;
  }
}
