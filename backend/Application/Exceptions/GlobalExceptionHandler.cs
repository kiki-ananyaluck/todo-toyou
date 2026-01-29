using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Application.Common;

namespace TodoApi.Application.Exceptions;

public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is ValidationException validationException)
        {
            var errors = validationException.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );

            var response = ApiResponse.Error(
                message: "Validation failed",
                statusCode: StatusCodes.Status400BadRequest
            );

            // Add validation errors to result
            response.Result = new { errors };

            httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

            return true;
        }

        // Handle other exceptions with standard response format
        var errorResponse = ApiResponse.Error(
            message: exception.Message,
            statusCode: StatusCodes.Status500InternalServerError
        );

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await httpContext.Response.WriteAsJsonAsync(errorResponse, cancellationToken);

        return true;
    }
}
