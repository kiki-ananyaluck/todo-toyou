// CreateTodoValidator.cs
using FluentValidation;

namespace TodoApi.Application.Todos.Commands.CreateTodo;

public class CreateTodoValidator : AbstractValidator<CreateTodoCommand>
{
    public CreateTodoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(100);

        RuleFor(x => x.DueDate)
            .NotEmpty();

        RuleFor(x => x.Type)
            .NotEmpty()
            .MaximumLength(50);
    }
}
