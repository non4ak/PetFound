using Domain.Models.DTOS.Geotags.Models;
using Domain.Models.DTOS.Geotags.Responses;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;

namespace Application.Geotags.Interfaces;

public interface IGeotagService
{
    Task<Result<IPagedList<GeotagResponse>>> GetPagedAsync(int pageNumber, int pageSize, GeotagListQueryModel queryModel);

    Task<Result<GeotagResponse>> GetByIdAsync(int id);

    Task<Result<GeotagResponse>> CreateAsync(int userId, CreateGeotagModel model);

    Task<Result<bool>> UpdateAsync(int userId, bool isAdmin, int id, UpdateGeotagModel model);

    Task<Result<bool>> DeleteAsync(int userId, bool isAdmin, int id);
}
