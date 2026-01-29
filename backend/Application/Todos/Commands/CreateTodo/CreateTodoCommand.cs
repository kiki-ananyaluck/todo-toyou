// CreateTodoCommand.cs
using MediatR;

namespace TodoApi.Application.Todos.Commands.CreateTodo;

public record CreateTodoCommand(string Title, DateTime DueDate, string Type) : IRequest<Guid>;
