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

        public class JobPosting
        {
            public string title { get; set; }
            public string company { get; set; }
            public string location { get; set; }
            public string job_link { get; set; }
            public string posted_date { get; set; }
            public string details { get; set; }
            public string skills { get; set; }
        }



        [HttpGet("getJobPostings/{userId}")]
        public async Task<IActionResult> GetJobPostings(int userId)
        {
            var userProfile = _context.UserProfiles.FirstOrDefault(p => p.UserId == userId);
            if (userProfile == null)
                return NotFound("Kullanıcı profili bulunamadı.");

            var userSkills = userProfile.Skills.Split(',', StringSplitOptions.RemoveEmptyEntries);

            var jsonFilePath = "Resources/Jobs.json";

            if (!System.IO.File.Exists(jsonFilePath))
                return NotFound("İş ilanları dosyası bulunamadı.");

            var jsonData = await System.IO.File.ReadAllTextAsync(jsonFilePath);
            var jobPostings = JsonConvert.DeserializeObject<List<JobPosting>>(jsonData);

            var filteredJobs = new List<object>();

            foreach (var job in jobPostings)
            {
                var jobTalents = !string.IsNullOrEmpty(job.skills)
                    ? job.skills.Split('|', StringSplitOptions.RemoveEmptyEntries)
                    : Array.Empty<string>();

                bool isMatch = userSkills.Any(userSkill =>
                    jobTalents.Any(jobSkill =>
                        string.Equals(userSkill.Trim(), jobSkill.Trim(), StringComparison.OrdinalIgnoreCase)
                    )
                );

                if (isMatch)
                {
                    filteredJobs.Add(new
                    {
                        Baslik = job.title ?? "Başlık bulunamadı",
                        Sirket = job.company ?? "Şirket bulunamadı",
                        Lokasyon = job.location ?? "Lokasyon bulunamadı",
                        Link = job.job_link ?? "Link bulunamadı",
                        YayimTarihi = job.posted_date ?? "Tarih bulunamadı",
                        Icerik = job.details ?? "Detay bulunamadı",
                        Beceriler = jobTalents
                    });
                }
            }

            return Ok(filteredJobs);
        }
    }
}
