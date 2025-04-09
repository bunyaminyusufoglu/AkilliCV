using Microsoft.AspNetCore.Mvc;
using AkilliCVBackend.Data;
using AkilliCVBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AkilliCVBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Email == user.Email);
            if (existingUser != null)
                return BadRequest("Bu e-posta zaten kayıtlı.");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok("Kayıt başarılı.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == user.Email && x.Password == user.Password);

            if (existingUser == null)
                return Unauthorized("Geçersiz e-posta veya şifre.");

            return Ok("Giriş başarılı.");
        }
    }
}
