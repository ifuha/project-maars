using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Api.Data;
using Api.Models;

namespace Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class TreeController : ControllerBase
{
  private readonly AppDbContext _context;
  public TreeController(AppDbContext context)
  {
    _context = context;
  }
  [HttpGet("post/{postId}")]
  public async Task<ActionResult> GetTreesByPost(int postId)
  {
    var count = await _context.Trees.CountAsync(t => t.PostId == postId);
    return Ok(new { postId, count });
  }
    [Authorize]
    [HttpPost]
    public async Task<ActionResult> CreateTree(Tree tree)
    {
    if (await _context.Trees.AnyAsync(t => t.PostId == tree.PostId && t.UserId == tree.UserId))
      return BadRequest("これ以上植えれない");
      _context.Trees.Add(tree);
      await _context.SaveChangesAsync();
      await UpdateTopic(tree.PostId);
    return Ok(tree);
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTree(int id)
    {
    var tree = await _context.Trees.FindAsync(id);
    if (tree == null) return NotFound();
    _context.Trees.Remove(tree);
    await _context.SaveChangesAsync();
    await UpdateTopic(tree.PostId);
    return NoContent();
  }

  private async Task UpdateTopic(int postId)
  {
    var count = await _context.Trees.CountAsync(t => t.PostId == postId);
    var existing = await _context.Topics.FirstOrDefaultAsync(t => t.PostId == postId);
    if(count >= 5)
    {
      if (existing == null)
      {
        _context.Topics.Add(new Topic { PostId = postId });
      }
      var topics = await _context.Topics.ToListAsync();
      var postIds = topics.Select(t => t.PostId).ToList();
      var counts = await _context.Trees
        .Where(t => postIds.Contains(t.PostId))
        .GroupBy(t => t.PostId)
        .Select(g => new { PostId = g.Key, Count = g.Count() })
        .OrderByDescending(g => g.Count)
        .ToListAsync();
      counts.Select((c, i) =>
    {
      var topic = topics.First(t => t.PostId == c.PostId);
      topic.Order = i + 1;
      return topic;
      }).ToList();
    }
    else if (existing != null)
    {
    _context.Topics.Remove(existing);
    }
    await _context.SaveChangesAsync();
  }
}