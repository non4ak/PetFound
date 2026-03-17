namespace Infrastructure.Common.Errors.Repository;

public static class RepositoryErrors<T>
{
    private static readonly string EntityName = typeof(T).Name;

    public static readonly Error NotFoundError =
        Error.NotFound($"Repository.{EntityName}.NotFoundError", $"{EntityName} not found");

    public static readonly Error UpdateError =
        Error.Conflict($"Repository.{EntityName}.UpdateError", $"{EntityName} couldn't be updated");

    public static readonly Error AddError =
        Error.Conflict($"Repository.{EntityName}.AddError", $"{EntityName} couldn't be added");

    public static readonly Error DeleteError =
        Error.NotFound($"Repository.{EntityName}.DeleteError", $"{EntityName} couldn't be deleted");
}
