using Application.Geotags.Interfaces;
using Domain.Extensions;
using Domain.Models;
using Domain.Models.DTOS.Geotags.Models;
using Domain.Models.DTOS.Geotags.Responses;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Errors.User;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Geotags.Services;

public class GeotagService : IGeotagService
{
    private readonly ApplicationDbContext _context;

    public GeotagService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<IPagedList<GeotagResponse>>> GetPagedAsync(int pageNumber, int pageSize, GeotagListQueryModel queryModel)
    {
        var query = _context.Geotags
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(queryModel.Search))
        {
            var search = queryModel.Search.Trim().ToLower();
            query = query.Where(g =>
                g.Title.ToLower().Contains(search) ||
                (g.Description != null && g.Description.ToLower().Contains(search)) ||
                (g.Address != null && g.Address.ToLower().Contains(search)));
        }

        if (queryModel.Category.HasValue)
        {
            query = query.Where(g => g.Category == queryModel.Category.Value);
        }

        if (queryModel.MinLatitude.HasValue)
        {
            query = query.Where(g => g.Latitude >= queryModel.MinLatitude.Value);
        }

        if (queryModel.MaxLatitude.HasValue)
        {
            query = query.Where(g => g.Latitude <= queryModel.MaxLatitude.Value);
        }

        if (queryModel.MinLongitude.HasValue)
        {
            query = query.Where(g => g.Longitude >= queryModel.MinLongitude.Value);
        }

        if (queryModel.MaxLongitude.HasValue)
        {
            query = query.Where(g => g.Longitude <= queryModel.MaxLongitude.Value);
        }

        query = query.OrderByDescending(g => g.CreatedOn).ThenByDescending(g => g.Id);

        var pagedEntities = await PagedList<Geotag>.CreateAsync(query, pageNumber, pageSize);
        var items = pagedEntities.Items.Select(MapResponse);

        IPagedList<GeotagResponse> paged = new PagedList<GeotagResponse>(
            currentPage: items,
            count: pagedEntities.TotalCount,
            pageNumber: pagedEntities.CurrentPage,
            pageSize: pagedEntities.PageSize
        )
        {
            TotalPages = pagedEntities.TotalPages
        };

        return Result<IPagedList<GeotagResponse>>.Success(paged);
    }

    public async Task<Result<GeotagResponse>> GetByIdAsync(int id)
    {
        var geotag = await _context.Geotags
            .AsNoTracking()
            .FirstOrDefaultAsync(g => g.Id == id);

        if (geotag is null)
        {
            return Result<GeotagResponse>.Failure(Error.NotFound("Geotag.NotFound", "Geotag not found"));
        }

        return Result<GeotagResponse>.Success(MapResponse(geotag));
    }

    public async Task<Result<GeotagResponse>> CreateAsync(int userId, CreateGeotagModel model)
    {
        var validation = Validate(model.Title, model.Latitude, model.Longitude);
        if (validation is not null)
        {
            return Result<GeotagResponse>.Failure(validation);
        }

        var now = DateTimeOffset.UtcNow;
        var geotag = new Geotag
        {
            Title = model.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(model.Description) ? null : model.Description.Trim(),
            Category = model.Category,
            Latitude = model.Latitude,
            Longitude = model.Longitude,
            Address = string.IsNullOrWhiteSpace(model.Address) ? null : model.Address.Trim(),
            PhotoUrl = string.IsNullOrWhiteSpace(model.PhotoUrl) ? null : model.PhotoUrl.Trim(),
            CreatedByUserId = userId,
            CreatedOn = now,
            LastModifiedOn = now
        };

        await _context.Geotags.AddAsync(geotag);
        await _context.SaveChangesAsync();

        return Result<GeotagResponse>.Success(MapResponse(geotag));
    }

    public async Task<Result<bool>> UpdateAsync(int userId, bool isAdmin, int id, UpdateGeotagModel model)
    {
        var geotag = await _context.Geotags.FirstOrDefaultAsync(g => g.Id == id);
        if (geotag is null)
        {
            return Result<bool>.Failure(Error.NotFound("Geotag.NotFound", "Geotag not found"));
        }

        if (!isAdmin && geotag.CreatedByUserId != userId)
        {
            return Result<bool>.Failure(Error.Forbidden("Geotag.Forbidden", "You can only edit your own geotags"));
        }

        var validation = Validate(model.Title, model.Latitude, model.Longitude);
        if (validation is not null)
        {
            return Result<bool>.Failure(validation);
        }

        geotag.Title = model.Title.Trim();
        geotag.Description = string.IsNullOrWhiteSpace(model.Description) ? null : model.Description.Trim();
        geotag.Category = model.Category;
        geotag.Latitude = model.Latitude;
        geotag.Longitude = model.Longitude;
        geotag.Address = string.IsNullOrWhiteSpace(model.Address) ? null : model.Address.Trim();
        geotag.PhotoUrl = string.IsNullOrWhiteSpace(model.PhotoUrl) ? null : model.PhotoUrl.Trim();
        geotag.LastModifiedOn = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteAsync(int userId, bool isAdmin, int id)
    {
        var geotag = await _context.Geotags.FirstOrDefaultAsync(g => g.Id == id);
        if (geotag is null)
        {
            return Result<bool>.Failure(Error.NotFound("Geotag.NotFound", "Geotag not found"));
        }

        if (!isAdmin && geotag.CreatedByUserId != userId)
        {
            return Result<bool>.Failure(Error.Forbidden("Geotag.Forbidden", "You can only delete your own geotags"));
        }

        _context.Geotags.Remove(geotag);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    private static Error? Validate(string title, decimal latitude, decimal longitude)
    {
        if (string.IsNullOrWhiteSpace(title))
            return UserErrors.RequiredField("title");
        if (latitude < -90m || latitude > 90m)
            return Error.Validation("Geotag.InvalidLatitude", "Latitude must be between -90 and 90");
        if (longitude < -180m || longitude > 180m)
            return Error.Validation("Geotag.InvalidLongitude", "Longitude must be between -180 and 180");
        return null;
    }

    private static GeotagResponse MapResponse(Geotag g)
    {
        return new GeotagResponse
        {
            Id = g.Id,
            Title = g.Title,
            Description = g.Description,
            Category = g.Category,
            CategoryLabel = g.Category.GetDisplayName(),
            Latitude = g.Latitude,
            Longitude = g.Longitude,
            Address = g.Address,
            PhotoUrl = g.PhotoUrl,
            CreatedByUserId = g.CreatedByUserId,
            CreatedOn = g.CreatedOn
        };
    }
}
