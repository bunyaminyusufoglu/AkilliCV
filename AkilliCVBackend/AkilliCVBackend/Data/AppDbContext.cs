using Microsoft.EntityFrameworkCore;
using AkilliCVBackend.Models;

namespace AkilliCVBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}
