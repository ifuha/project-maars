using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;

namespace Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class TopicController : Controller
{
  private readonly AppDbContext _context;
  public TopicController(AppDbContext context)
  {
    _context = context;
  }
  [HttpGet]
  public async Task<ActionResult<IEnumerable<Topic>>> GetTopics()
  {
      return await _context.Topics
      .OrderBy(t => t.Order)
      .ToListAsync();
  }
  [HttpGet("tree/{treeId}")]
  public async Task<ActionResult<IEnumerable<Topic>>> GetTopicsByTree(int treeId)
  {
    return await _context.Topics
      .Where(t => t.TreeId == treeId)
      .OrderBy(t => t.Order)
      .ToListAsync();
  }
}