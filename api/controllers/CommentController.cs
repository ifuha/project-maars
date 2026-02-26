using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Api.Data;
using Api.Models;

namespace Api.Controllers;

[ApiController]
[Route("/api/[controller]")]

public class CommentController : Controller
{
  private readonly AppDbContext _context;
  public CommentController(AppDbContext context)
  {
    _context = context;
  }
  [HttpGet("post/{postId}")]
  public async Task<ActionResult<IEnumerable<Comment>>> GetComment(int postId)
  {
    return await _context.Comments
      .Where(c => c.PostId == postId)
      .ToListAsync();
  }
  [Authorize]
  [HttpPost]
  public async Task<ActionResult<Comment>> CreateComment(Comment comment)
  {
    _context.Comments.Add(comment);
    await _context.SaveChangesAsync();
    return Ok(comment);
  }
  [Authorize]
  [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null) return NotFound();
        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}