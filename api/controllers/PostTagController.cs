using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Api.Data;
using Api.Models;

namespace Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class PostTagController : ControllerBase
{
    private readonly AppDbContext _context;

    public PostTagController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("post/{postId}")]
    public async Task<ActionResult<IEnumerable<PostTag>>> GetTagsByPost(int postId)
    {
        return await _context.PostTags
            .Where(pt => pt.PostId == postId)
            .Include(pt => pt.Tag)
            .ToListAsync();
    }
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PostTag>> CreatePostTag(PostTag postTag)
    {
        if (await _context.PostTags.AnyAsync(pt => pt.PostId == postTag.PostId && pt.TagId == postTag.TagId))
            return BadRequest("既に紐付けされています");

        _context.PostTags.Add(postTag);
        await _context.SaveChangesAsync();
        return Ok(postTag);
    }
    [Authorize]
    [HttpDelete("post/{postId}/tag/{tagId}")]
    public async Task<IActionResult> DeletePostTag(int postId, int tagId)
    {
        var postTag = await _context.PostTags
            .FirstOrDefaultAsync(pt => pt.PostId == postId && pt.TagId == tagId);
        if (postTag == null) return NotFound();
        _context.PostTags.Remove(postTag);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}