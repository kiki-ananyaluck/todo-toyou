// Domain/Entities/Todo.cs
namespace TodoApi.Domain.Entities;

public class Todo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = default!;
    public DateTime DueDate { get; set; } = DateTime.UtcNow;
    public bool IsCompleted { get; set; } = false;
    public string Type { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}
