using Microsoft.AspNetCore.Mvc;
using AkilliCVBackend.Models;
using AkilliCVBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace AkilliCVBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserProfileController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPut("updateProfile/{userId}")]
        public IActionResult UpdateProfile(int userId, [FromBody] UserProfile userProfile)
        {
            var existingProfile = _context.UserProfiles.FirstOrDefault(p => p.UserId == userId);

            if (existingProfile == null)
                return NotFound("Kullanıcı profili bulunamadı.");

            existingProfile.DateOfBirth = userProfile.DateOfBirth;
            existingProfile.PhoneNumber = userProfile.PhoneNumber;
            existingProfile.Email = userProfile.Email;
            existingProfile.Education = userProfile.Education;
            existingProfile.WorkExperience = userProfile.WorkExperience;
            existingProfile.Skills = userProfile.Skills;
            existingProfile.Languages = userProfile.Languages;
            existingProfile.References = userProfile.References;
            existingProfile.PortfolioLink = userProfile.PortfolioLink;
            existingProfile.DesiredSalary = userProfile.DesiredSalary;
            existingProfile.WorkTypePreference = userProfile.WorkTypePreference;

            _context.SaveChanges();

            return Ok("Profil başarıyla güncellendi.");
        }

        [HttpGet("getProfile/{userId}")]
        public IActionResult GetProfile(int userId)
        {
            var userProfile = _context.UserProfiles.FirstOrDefault(p => p.UserId == userId);

            if (userProfile == null)
                return NotFound("Kullanıcı profili bulunamadı.");

            return Ok(userProfile);
        }
    }
}
