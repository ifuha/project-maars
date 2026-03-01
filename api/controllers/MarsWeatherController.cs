using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;

namespace Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class MarsWeatherController : ControllerBase
{
    private readonly AppDbContext _context;

    public MarsWeatherController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MarsWeather>>> GetMarsWeathers()
    {
        return await _context.MarsWeathers
            .OrderByDescending(m => m.Sol)
            .Take(7)
            .ToListAsync();
    }
}