// GetPaginatedTodosQuery.cs
using MediatR;

namespace TodoApi.Application.Todos.Queries.GetTodos;

public record GetPaginatedTodosQuery(int PageNumber, int PageSize) : IRequest<PaginatedResult<TodoDto>>
{
    // Ensure minimum values
    public int PageNumber { get; init; } = PageNumber < 1 ? 1 : PageNumber;
    public int PageSize { get; init; } = PageSize < 1 ? 10 : (PageSize > 100 ? 100 : PageSize);
}

public record PaginatedResult<T>(
    List<T> Items,
    int PageNumber,
    int PageSize,
    int TotalCount,
    int TotalPages,
    bool HasPreviousPage,
    bool HasNextPage
);
