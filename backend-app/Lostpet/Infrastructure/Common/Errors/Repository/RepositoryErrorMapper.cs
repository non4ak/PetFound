using Npgsql;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Common.Errors.Repository;

public static class RepositoryErrorMapper<T>
{
    public static Error Map(DbUpdateException ex)
    {
        if (ex is DbUpdateConcurrencyException)
        {
            return RepositoryErrors<T>.UpdateError;
        }

        if (ex.InnerException is PostgresException pgEx)
        {
            switch (pgEx.SqlState)
            {
                case PostgresErrorCodes.UniqueViolation:
                    return RepositoryErrors<T>.AddError;
                case PostgresErrorCodes.ForeignKeyViolation:
                    if (pgEx.Message.Contains("DELETE", StringComparison.OrdinalIgnoreCase))
                    {
                        return RepositoryErrors<T>.DeleteError;
                    }
                    return RepositoryErrors<T>.UpdateError;
                default:
                    return RepositoryErrors<T>.UpdateError;
            }
        }

        return RepositoryErrors<T>.UpdateError;
    }
}
