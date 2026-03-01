namespace Api.Models;

public class MarsWeather
{
    public int Id { get; set; }
    public string Sol { get; set; } = string.Empty;
    public double TempMax { get; set; }
    public double TempMin { get; set; }
    public double TempAvg { get; set; }
    public double Pressure { get; set; }
    public double WindSpeed { get; set; }
    public DateTime FetchedAt { get; set; }
}