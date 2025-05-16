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
            var jsonFilePath = "Resources/Jobs.json"; // Ensure this path is correct relative to the project structure
            var jsonData = await System.IO.File.ReadAllTextAsync(jsonFilePath);
            var jobPostings = JsonConvert.DeserializeObject<List<dynamic>>(jsonData);

            var filteredJobs = new List<object>();

            foreach (var job in jobPostings)
            {
                var jobTitle = job.job_title != null ? job.job_title.ToString() : "Başlık bulunamadı";
                var jobContent = job.job_summary != null ? job.job_summary.ToString() : "İçerik bulunamadı";
                var jobLocation = job.job_location != null ? job.job_location.ToString() : "Lokasyon bulunamadı";
                var jobTalents = job.talents != null ? job.talents.ToString().Split(',') : new string[0];

                // Check if any of the user's skills match the job's talents
                if (userSkills.Any(skill => jobTalents.Contains(skill, StringComparison.OrdinalIgnoreCase)))
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
