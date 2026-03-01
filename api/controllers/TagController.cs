using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Api.Data;
using Api.Models;

namespace Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class TagController : ControllerBase
{
    private readonly AppDbContext _context;

    public TagController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tag>>> GetTags()
    {
        return await _context.Tags.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Tag>> GetTag(int id)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null) return NotFound();
        return tag;
    }
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Tag>> CreateTag(Tag tag)
    {
        if (await _context.Tags.AnyAsync(t => t.Name == tag.Name))
            return BadRequest("既に存在するタグです");

        var newTag = new Tag
            {
                Name = tag.Name
            };

        _context.Tags.Add(newTag);

        _context.Tags.Add(newTag);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTag), new { id = newTag.TagId }, newTag);
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTag(int id)
    {
        var tag = await _context.Tags.FindAsync(id);
        if (tag == null) return NotFound();
        _context.Tags.Remove(tag);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}