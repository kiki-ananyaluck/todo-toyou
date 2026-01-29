// CreateTodoHandler.cs
using MediatR;
using TodoApi.Application.Mappings;
using TodoApi.Domain.Entities;
using TodoApi.Infrastructure.Persistence;

namespace TodoApi.Application.Todos.Commands.CreateTodo;

public class CreateTodoHandler : IRequestHandler<CreateTodoCommand, Guid>
{
    private readonly AppDbContext _context;
    private readonly TodoMapper _mapper;

    public CreateTodoHandler(AppDbContext context, TodoMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Guid> Handle(CreateTodoCommand request, CancellationToken ct)
    {
        // use mapper to map request to todo entity
        var todo = _mapper.ToTodo(request);
        
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync(ct);
        
        return todo.Id;
    }
}
