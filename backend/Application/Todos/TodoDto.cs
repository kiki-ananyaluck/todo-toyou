namespace TodoApi.Application.Todos;

public record TodoDto(
    Guid Id,
    string Title,
    DateTime DueDate,
    bool IsCompleted,
    string Type,
    DateTime CreatedAt
);
