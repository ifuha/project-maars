namespace Api.Models;

public class Post
{
  public int PostId { get;set; }
  public int UserId { get;set; }
  public string Content { get;set; } = string.Empty;
  public string Title { get;set; } = string.Empty;
  public string Thumbnail { get;set; } = string.Empty;
  public bool IsPrivate { get;set; }
  public User User { get;set; } = null!;
  public ICollection<Comment> Comments { get;set; } = new List<Comment>();
  public ICollection<PostTag> PostTags { get;set; } = new List<PostTag>();
}