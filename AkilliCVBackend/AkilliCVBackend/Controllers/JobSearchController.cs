using Microsoft.AspNetCore.Mvc;
using AkilliCVBackend.Data;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System;
using HtmlAgilityPack;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace AkilliCVBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobSearchController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;

        public JobSearchController(AppDbContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
        }

        [HttpGet("getJobPostings/{userId}")]
        public async Task<IActionResult> GetJobPostings(int userId)
        {
            var userProfile = _context.UserProfiles.FirstOrDefault(p => p.UserId == userId);
            if (userProfile == null)
                return NotFound("Kullanıcı profili bulunamadı.");

            var userSkills = userProfile.Skills.Split(',');

            // Read job postings from a local JSON file
            var jsonFilePath = "path/to/jobPostings.json"; // Update this path to the actual JSON file path
            var jsonData = await System.IO.File.ReadAllTextAsync(jsonFilePath);
            var jobPostings = JsonConvert.DeserializeObject<List<dynamic>>(jsonData);

            var filteredJobs = new List<object>();

            foreach (var job in jobPostings)
            {
                var jobTitle = job.Baslik != null ? job.Baslik.ToString() : "Başlık bulunamadı";
                var jobContent = job.Icerik != null ? job.Icerik.ToString() : "İçerik bulunamadı";
                var jobLocation = job.Lokasyon != null ? job.Lokasyon.ToString() : "Lokasyon bulunamadı";

                // Check if job title or content contains any of the user's skills
                if (userSkills.Any(skill => jobTitle.Contains(skill, StringComparison.OrdinalIgnoreCase) || jobContent.Contains(skill, StringComparison.OrdinalIgnoreCase)))
                {
                    // Add job details to the list
                    filteredJobs.Add(new {
                        Baslik = jobTitle,
                        Icerik = jobContent,
                        Lokasyon = jobLocation
                    });
                }
            }

            return Ok(filteredJobs);
        }
    }
}
