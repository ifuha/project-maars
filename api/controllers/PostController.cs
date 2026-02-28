using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;


namespace Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class PostController : ControllerBase
{
  private readonly AppDbContext _context;
  public PostController(AppDbContext context)
  {
    _context = context;
  }
  [HttpGet]
  public async Task<ActionResult<IEnumerable<Post>>> GetPosts([FromQuery] int? tagId)
  {
    var query = _context.Posts
        .Where(p => !p.IsPrivate)
        .Include(p => p.User)
        .Include(p => p.PostTags)
          .ThenInclude(pt => pt.Tag)
        .Include(p => p.Comments)
        .AsQueryable();

    if (tagId.HasValue)
    {
      query = query.Where(p => p.PostTags.Any(pt => pt.TagId == tagId.Value));
    }
    return await query.ToListAsync();
  }
  [HttpGet("{id}")]
  public async Task<ActionResult<Post>> GetPost(int id)
  {
    var post = await _context.Posts
      .Include(p => p.User)
      .Include(p => p.PostTags)
        .ThenInclude(pt => pt.Tag)
      .Include(p => p.Comments)
      .FirstOrDefaultAsync(p => p.PostId == id);

    if (post == null) return NotFound();
    if (post.IsPrivate) return Forbid();
      return post;
  }
  [HttpGet("user/{userId}")]
  public async Task<ActionResult<IEnumerable<Post>>> GetPostsByUser(int userId)
  {
    var currentUserIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    var currentUserId = currentUserIdClaim != null ? int.Parse(currentUserIdClaim) : (int?)null;
    return await _context.Posts
      .Where(p => p.UserId == userId && (!p.IsPrivate || currentUserId == userId))
      .Include(p => p.User)
      .Include(p => p.PostTags)
        .ThenInclude(pt => pt.Tag)
      .Include(p => p.Comments)
      .ToListAsync();
  }
  [Authorize]
  [HttpPost]
  public async Task<ActionResult<Post>> CreatePost(Post dto)
  {
    var post = new Post
    {
        UserId = dto.UserId,
        Title = dto.Title,
        Content = dto.Content,
        Thumbnail = dto.Thumbnail,
        IsPrivate = dto.IsPrivate
    };
    _context.Posts.Add(post);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetPost), new { id = post.PostId }, post);
  }
  [Authorize]
  [HttpPut("{id}")]
  public async Task<ActionResult> UpdataPost(int id, Post post)
  {
      if (id != post.PostId) return BadRequest();
      _context.Entry(post).State = EntityState.Modified;
      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!_context.Posts.Any(p => p.PostId == id)) return NotFound();
        throw;
      }
    return NoContent();
  }
  [Authorize]
  [HttpDelete("{id}")]
  public async Task<IActionResult> DeletePost(int id)
  {
    var post = await _context.Posts.FindAsync(id);
    if (post == null) return NotFound();
    _context.Posts.Remove(post);
    await _context.SaveChangesAsync();
    return NoContent();
  }
  public record CreatePostDto(int UserId, string Title, string Content, string Thumbnail, bool IsPrivate);
}