namespace Api.Models;

public class User
{
  public int UserId { get;set; }
  public string Name { get;set; } = string.Empty;
  public string Email { get;set; } = string.Empty;
  public string Password { get;set; } = string.Empty;
  public string Icon { get;set; } = string.Empty;
  public string Header { get;set; } = string.Empty;
  public string? Bio { get;set; }
  public ICollection<Post> Posts { get;set; } = new List<Post>();
  public ICollection<Tree> Trees { get;set; } = new List<Tree>();
  public ICollection<Comment> Comments { get;set; } = new List<Comment>();
}