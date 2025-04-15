using Microsoft.AspNetCore.Mvc;
using AkilliCVBackend.Models;
using AkilliCVBackend.Data;
using System.Linq;

namespace AkilliCVBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobSearchController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobSearchController(AppDbContext context)
        {
            _context = context;
        }

        // Kullanıcı profiline göre LinkedIn iş arama linki oluşturma
        [HttpGet("generateJobSearchLink/{userId}")]
        public IActionResult GenerateJobSearchLink(int userId)
        {
            var userProfile = _context.UserProfiles.FirstOrDefault(p => p.UserId == userId);
            if (userProfile == null)
                return NotFound("Kullanıcı profili bulunamadı.");

            // Yetenekleri LinkedIn URL formatında birleştir
            var skills = userProfile.Skills.Split(',');  // Yetenekler virgülle ayrılmış kabul ediliyor
            var searchQuery = string.Join("%20", skills);
            var linkedinUrl = $"https://www.linkedin.com/jobs/search/?keywords={searchQuery}";

            return Ok(new { link = linkedinUrl });
        }
    }
}
