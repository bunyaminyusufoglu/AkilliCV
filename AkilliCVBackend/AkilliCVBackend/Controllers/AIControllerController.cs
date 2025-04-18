using Microsoft.AspNetCore.Mvc;
using AkilliCVBackend.Services;
using AkilliCVBackend.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace AkilliCVBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly AIService _aiService;
        private readonly AppDbContext _context;  // DbContext'i controller'a enjekte ediyoruz
        private readonly ILogger<AIController> _logger;  // Logger ekleyerek hata ve başarıları loglayabiliriz

        // DbContext'i, AIService'i ve Logger'ı enjekte et
        public AIController(AppDbContext context, AIService aiService, ILogger<AIController> logger)
        {
            _context = context;
            _aiService = aiService;
            _logger = logger;
        }

        // CV analizi için POST endpoint'i
        [HttpPost("analyzeCV")]
        public async Task<IActionResult> AnalyzeCV(int userId)
        {
            try
            {
                // Kullanıcıya ait CV'yi veritabanından al
                var cv = await _context.CVs.FirstOrDefaultAsync(c => c.UserId == userId);

                if (cv == null)
                {
                    _logger.LogWarning($"User with ID {userId} does not have a CV.");
                    return NotFound("CV bulunamadı.");  // CV bulunamadığında 404 dönüyoruz
                }

                // CV'nin dosya yolunu al
                string filePath = cv.FilePath;

                // AI API'sine CV'yi gönder ve sonucu al
                var analysisResult = await _aiService.AnalyzeCVAsync(filePath);

                if (string.IsNullOrEmpty(analysisResult))
                {
                    _logger.LogError($"AI analysis failed for user with ID {userId}. No result returned.");
                    return BadRequest("CV analizi sırasında hata oluştu.");
                }

                _logger.LogInformation($"AI analysis completed successfully for user with ID {userId}.");
                return Ok(analysisResult);
            }
            catch (Exception ex)
            {
                // Genel hata durumunda log kaydı yapıyoruz
                _logger.LogError($"An error occurred while analyzing CV for user with ID {userId}: {ex.Message}");
                return StatusCode(500, "Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        }
    }
}
