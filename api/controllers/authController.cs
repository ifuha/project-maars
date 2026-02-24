using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Api.Data;
using Api.Models;

namespace Api.Models;

[ApiController]
[Route("/api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;
  public AuthController (AppDbContext context , IConfiguration config){
    _context = context;
    _config = config;
  }
  [HttpPost("register")]
  public async Task<ActionResult<User>> Register(RegisterDto dto)
  {
    if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
      return BadRequest("このメールアドレスはすでに使用されています");
    var user = new User
    {
      Name = dto.Name,
      Email = dto.Email,
      Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();
    return Ok(new { user.UserId, user.Name, user.Email });
  }
  [HttpGet("login")]
  public async Task<ActionResult> Login(LoginDto dto)
  {
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
      if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
        return Unauthorized("メールアドレスまたはパスワードが違います");
      var token = GenerateToken(user);

      return Ok(new { token, user.UserId, user.Name, user.Email });
  }
  private string GenerateToken(User user)
  {
    var claims = new[]
        {
        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Email, user.Email)
      };
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
      var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddDays(7),
        signingCredentials: creds
    );
    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}

public record RegisterDto(string Name, string Email, string Password);
public record LoginDto(string Email, string Password);