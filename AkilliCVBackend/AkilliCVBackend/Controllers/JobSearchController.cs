using Microsoft.AspNetCore.Mvc;
using AkilliCVBackend.Data;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System;
using HtmlAgilityPack;
using System.Collections.Generic;

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
            var keyword = Uri.EscapeDataString(string.Join(" ", userSkills));

            // Sabit URL'yi oluşturun ve kullanıcının yeteneklerini ekleyin
            var url = $"https://www.linkedin.com/jobs/search/?currentJobId=4227285827&distance=25&geoId=102105699&keywords={keyword}&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true";

            try
            {
                // Add cookie management
                var handler = new HttpClientHandler();
                handler.CookieContainer = new System.Net.CookieContainer();

                // Create HttpClient with handler
                var httpClient = new HttpClient(handler);

                // Update User-Agent header
                var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

                // Add cookies if necessary
                // handler.CookieContainer.Add(new Uri("https://www.linkedin.com"), new Cookie("name", "value"));

                // HTTP isteği gönder ve yanıtı al
                var response = await httpClient.SendAsync(request);

                // Yanıt başarılıysa, içeriği al
                if (response.IsSuccessStatusCode)
                {
                    var htmlContent = await response.Content.ReadAsStringAsync();

                    // HTML içeriğini parse et
                    var htmlDoc = new HtmlDocument();
                    htmlDoc.LoadHtml(htmlContent);

                    // Belirli bir sınıfa sahip öğeleri seç
                    var jobNodes = htmlDoc.DocumentNode.SelectNodes("//ul[contains(@class, 'jobs-search__results-list')]");

                    var jobList = new List<string>();
                    if (jobNodes != null)
                    {
                        // İlk 5 <li> etiketini al
                        var liNodes = jobNodes.Descendants("li").Take(5);

                        foreach (var liNode in liNodes)
                        {
                            // Her <li> etiketindeki bilgileri al
                            var jobTitleNode = liNode.SelectSingleNode(".//a[contains(@class, 'job-card-container__link')]");
                            var companyNode = liNode.SelectSingleNode(".//span[contains(@class, 'nPkqPgpupRuxMarNgRsDMtMYCzGImGyDpY')]");
                            var locationNode = liNode.SelectSingleNode(".//span[contains(@class, 'job-card-container__metadata-wrapper')]//li");

                            var jobTitle = jobTitleNode != null ? jobTitleNode.InnerText.Trim() : "Başlık bulunamadı";
                            var company = companyNode != null ? companyNode.InnerText.Trim() : "Şirket bulunamadı";
                            var location = locationNode != null ? locationNode.InnerText.Trim() : "Konum bulunamadı";

                            // Bilgileri birleştir ve listeye ekle
                            var jobInfo = $"Başlık: {jobTitle}, Şirket: {company}, Konum: {location}";
                            jobList.Add(jobInfo);
                        }
                    }

                    return Ok(jobList);
                }
                else
                {
                    return StatusCode((int)response.StatusCode, "İş ilanları sayfası alınamadı.");
                }
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama veya hata yönetimi yapabilirsiniz
                return StatusCode(500, "Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        }
    }
}
