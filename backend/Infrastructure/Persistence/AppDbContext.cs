// Infrastructure/Persistence/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using TodoApi.Domain.Entities;

namespace TodoApi.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Todo> Todos => Set<Todo>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Todo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
        });
    }
}
