using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

  public DbSet<User> Users => Set<User>();
  public DbSet<Post> Posts => Set<Post>();
  public DbSet<Comment> Comments => Set<Comment>();
  public DbSet<Tree> Trees => Set<Tree>();
  public DbSet<Topic> Topics => Set<Topic>();
  public DbSet<Tag> Tags => Set<Tag>();
  public DbSet<PostTag> PostTags => Set<PostTag>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);
    modelBuilder.Entity<PostTag>()
      .HasKey(pt => new { pt.PostId, pt.TagId });
  }
}