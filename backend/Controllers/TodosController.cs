using MediatR;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Application.Common;
using TodoApi.Application.Todos;
using TodoApi.Application.Todos.Commands.CreateTodo;
using TodoApi.Application.Todos.Queries.GetTodos;

[ApiController]
[Route("api/todos")]
public class TodosController : ControllerBase
{
    private readonly IMediator _mediator;

    public TodosController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Create a new Todo
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create(CreateTodoCommand command)
    {
        var id = await _mediator.Send(command);
        var response = ApiResponse.Success(
            result: new { id },
            message: "Todo created successfully",
            statusCode: 201
        );
        return StatusCode(response.StatusCode, response);
    }

    /// <summary>
    /// Get paginated list of Todos
    /// </summary>
    [HttpGet("paginated")]
    public async Task<IActionResult> GetPaginated([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var query = new GetPaginatedTodosQuery(pageNumber, pageSize);
        var result = await _mediator.Send(query);
        var response = ApiResponse<PaginatedResult<TodoDto>>.Success(
            result: result,
            message: "Todos retrieved successfully",
            statusCode: 200
        );
        return Ok(response);
    }
}
