// GetPaginatedTodosHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using TodoApi.Application.Mappings;
using TodoApi.Infrastructure.Persistence;

namespace TodoApi.Application.Todos.Queries.GetTodos;

public class GetPaginatedTodosHandler : IRequestHandler<GetPaginatedTodosQuery, PaginatedResult<TodoDto>>
{
    private readonly AppDbContext _context;
    private readonly TodoMapper _mapper;

    public GetPaginatedTodosHandler(AppDbContext context, TodoMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedResult<TodoDto>> Handle(GetPaginatedTodosQuery request, CancellationToken ct)
    {
        // Get total count first (efficient query - no includes needed)
        var totalCount = await _context.Todos.CountAsync(ct);

        // Calculate pagination metadata
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);
        var hasPreviousPage = request.PageNumber > 1;
        var hasNextPage = request.PageNumber < totalPages;

        // Fetch only the required page of data with related Details
        var todos = await _context.Todos
            .AsNoTracking() // Performance: read-only query
            .OrderByDescending(x => x.CreatedAt) // Consistent ordering for pagination
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        // Map to DTOs
        var todoDtos = todos.Select(t => _mapper.ToTodoDto(t)).ToList();

        return new PaginatedResult<TodoDto>(
            Items: todoDtos,
            PageNumber: request.PageNumber,
            PageSize: request.PageSize,
            TotalCount: totalCount,
            TotalPages: totalPages,
            HasPreviousPage: hasPreviousPage,
            HasNextPage: hasNextPage
        );
    }
}
