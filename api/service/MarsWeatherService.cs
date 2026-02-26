using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Api.Data;
using Api.Models;

namespace Api.Services;

public class MarsWeatherService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public MarsWeatherService(IServiceScopeFactory scopeFactory, IConfiguration config, IHttpClientFactory httpClientFactory)
    {
        _scopeFactory = scopeFactory;
        _config = config;
        _httpClient = httpClientFactory.CreateClient();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // 起動時に1回取得
        await FetchAndSave();

        // 24時間ごとに更新
        using var timer = new PeriodicTimer(TimeSpan.FromHours(24));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await FetchAndSave();
        }
    }

    private async Task FetchAndSave()
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var apiKey = _config["Nasa:ApiKey"];
            var url = $"https://api.nasa.gov/insight_weather/?api_key={apiKey}&feedtype=json&ver=1.0";

            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return;

            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);

            var solKeys = doc.RootElement.GetProperty("sol_keys").EnumerateArray()
                .Select(s => s.GetString()!)
                .ToList();

            foreach (var sol in solKeys)
            {
                if (await context.MarsWeathers.AnyAsync(m => m.Sol == sol)) continue;

                var solData = doc.RootElement.GetProperty(sol);
                var weather = new MarsWeather { Sol = sol, FetchedAt = DateTime.UtcNow };

                if (solData.TryGetProperty("AT", out var at))
                {
                    weather.TempMax = at.TryGetProperty("mx", out var mx) ? mx.GetDouble() : 0;
                    weather.TempMin = at.TryGetProperty("mn", out var mn) ? mn.GetDouble() : 0;
                    weather.TempAvg = at.TryGetProperty("av", out var av) ? av.GetDouble() : 0;
                }

                if (solData.TryGetProperty("PRE", out var pre))
                    weather.Pressure = pre.TryGetProperty("av", out var pav) ? pav.GetDouble() : 0;

                if (solData.TryGetProperty("HWS", out var hws))
                    weather.WindSpeed = hws.TryGetProperty("av", out var wav) ? wav.GetDouble() : 0;

                context.MarsWeathers.Add(weather);
            }

            await context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"MarsWeather取得エラー: {ex.Message}");
        }
    }
}