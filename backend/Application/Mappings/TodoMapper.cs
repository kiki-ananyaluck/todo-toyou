using Riok.Mapperly.Abstractions;
using TodoApi.Application.Todos;
using TodoApi.Application.Todos.Commands.CreateTodo;
using TodoApi.Domain.Entities;

namespace TodoApi.Application.Mappings;

[Mapper]
public partial class TodoMapper
{
    public partial Todo ToTodo(CreateTodoCommand command);
    public partial TodoDto ToTodoDto(Todo todo);
    public partial List<TodoDto> ToDtoList(List<Todo> todos);
}
