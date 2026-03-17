using Infrastructure.Common.Errors;

namespace Infrastructure.Common.ResultPattern;

public class Result
{
    protected Result(bool isSuccess, Error error)
    {
        IsSuccess = isSuccess;
        Error = error;
  ***REMOVED***

    public bool IsSuccess { get; protected set; }

    public Error Error { get; protected set; }

    public static Result Success()
    {
        return new Result(true, null);
  ***REMOVED***

    public static Result Failure(Error error)
    {
        return new Result(false, error);
  ***REMOVED***
}

public class Result<T> : Result
{
    public T Value { get; private set; }

    private Result(bool isSuccess, T value, Error error)
        : base(isSuccess, error)
    {
        Value = value;
  ***REMOVED***

    public static Result<T> Success(T value, string message = "success")
    {
        return new Result<T>(true, value, null);
  ***REMOVED***

    public static Result<T> Failure(Error error, T value = default)
    {
        return new Result<T>(false, value, error);
  ***REMOVED***
}
