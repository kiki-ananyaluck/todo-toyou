namespace TodoApi.Application.Common;

/// <summary>
/// Standard API response wrapper for all endpoints
/// </summary>
public class ApiResponse<T>
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Result { get; set; }

    public static ApiResponse<T> Success(T result, string message = "Success", int statusCode = 200)
    {
        return new ApiResponse<T>
        {
            StatusCode = statusCode,
            Message = message,
            Result = result
        };
    }

    public static ApiResponse<T> Error(string message, int statusCode = 400)
    {
        return new ApiResponse<T>
        {
            StatusCode = statusCode,
            Message = message,
            Result = default
        };
    }
}

/// <summary>
/// Standard API response wrapper without data (for void operations)
/// </summary>
public class ApiResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Result { get; set; }

    public static ApiResponse Success(string message = "Success", int statusCode = 200)
    {
        return new ApiResponse
        {
            StatusCode = statusCode,
            Message = message,
            Result = null
        };
    }

    public static ApiResponse Success(object result, string message = "Success", int statusCode = 200)
    {
        return new ApiResponse
        {
            StatusCode = statusCode,
            Message = message,
            Result = result
        };
    }

    public static ApiResponse Error(string message, int statusCode = 400)
    {
        return new ApiResponse
        {
            StatusCode = statusCode,
            Message = message,
            Result = null
        };
    }
}
