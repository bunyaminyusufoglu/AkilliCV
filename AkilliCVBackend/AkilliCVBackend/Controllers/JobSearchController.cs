using Microsoft.AspNetCore.Mvc;
using AkilliCVBackend.Data;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System;

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

        [HttpGet("getJobPostings/{userId}")]
        public async Task<IActionResult> GetJobPostings(int userId)
        {
            var userProfile = _context.UserProfiles.FirstOrDefault(p => p.UserId == userId);
            if (userProfile == null)
                return NotFound("Kullanıcı profili bulunamadı.");

            var skills = userProfile.Skills.Split(',');
            var keyword = Uri.EscapeDataString(string.Join(" ", skills));

            var url = $"https://linkedin-job-api.p.rapidapi.com/job/search?keyword={keyword}&page=1";

            var client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(url),
                Headers =
                {
                    { "x-rapidapi-host", "linkedin-job-api.p.rapidapi.com" },
                    { "x-rapidapi-key", "22c4d851afmsh0babdd08f5b66e4p151ce5jsn71f6b54b4d02" }
                },
            };

            using (var response = await client.SendAsync(request))
            {
                if (!response.IsSuccessStatusCode)
                    return StatusCode((int)response.StatusCode, "LinkedIn iş ilanları alınamadı.");

                var body = await response.Content.ReadAsStringAsync();
                return Content(body, "application/json");
            }
        }
    }
}
