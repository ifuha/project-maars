namespace Api.Models;

public class Comment
{
  public int CommentId { get;set; }
  public string Content { get;set; } = string.Empty;
  public int PostId { get;set; }
  public int UserId { get;set; }
}