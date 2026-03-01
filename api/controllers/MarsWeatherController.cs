using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;

namespace Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class MarsWeatherService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public MarsWeatherService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        if (!context.MarsWeathers.Any())
        {
            var random = new Random();
            var weathers = Enumerable.Range(1, 7).Select(i => new MarsWeather
            {
                Sol = $"{1000 + i}",
                TempMax = Math.Round(-20 + random.NextDouble() * 30, 1),
                TempMin = Math.Round(-80 + random.NextDouble() * 30, 1),
                TempAvg = Math.Round(-50 + random.NextDouble() * 20, 1),
                Pressure = Math.Round(700 + random.NextDouble() * 100, 1),
                WindSpeed = Math.Round(random.NextDouble() * 20, 1),
                FetchedAt = DateTime.UtcNow
            }).ToList();

            context.MarsWeathers.AddRange(weathers);
            await context.SaveChangesAsync();
        }
    }
}