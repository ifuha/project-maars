using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Api.Data;
using Api.Models;

namespace Api.Controllers;

[ApiController]
[Route("api/tree")]
public class TreeController : ControllerBase
{
    private readonly AppDbContext _context;
    public TreeController(AppDbContext context) { _context = context; }

    [HttpGet("post/{postId}")]
    public async Task<ActionResult> GetTreesByPost(int postId)
    {
        var count = await _context.Trees.CountAsync(t => t.PostId == postId);
        return Ok(new { postId, count });
    }

    [HttpGet("user/{userId}/post/{postId}")]
    public async Task<ActionResult<Tree>> GetTree(int userId, int postId)
    {
        var tree = await _context.Trees
            .FirstOrDefaultAsync(t => t.UserId == userId && t.PostId == postId);
        if (tree == null) return NotFound();
        return tree;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Tree>> CreateTree(Tree tree)
    {
        if (await _context.Trees.AnyAsync(t => t.PostId == tree.PostId && t.UserId == tree.UserId))
            return BadRequest();

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

        if (count >= 5)
        {
            if (existing == null)
            {
                existing = new Topic { PostId = postId };
                _context.Topics.Add(existing);
                await _context.SaveChangesAsync();
            }

            var topics = await _context.Topics.ToListAsync();
            var counts = await _context.Trees
                .GroupBy(t => t.PostId)
                .Select(g => new { PostId = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .ToListAsync();

            for (int i = 0; i < counts.Count; i++)
            {
                var topic = topics.FirstOrDefault(t => t.PostId == counts[i].PostId);
                if (topic != null) topic.Order = i + 1;
            }
        }
        else if (existing != null)
        {
            _context.Topics.Remove(existing);
        }
        await _context.SaveChangesAsync();
    }
}