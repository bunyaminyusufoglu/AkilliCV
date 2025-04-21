using Microsoft.AspNetCore.Mvc;
using AkilliCVBackend.Services;
using AkilliCVBackend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace AkilliCVBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly AIService _aiService;
        private readonly AppDbContext _context;
        private readonly ILogger<AIController> _logger;

        public AIController(AppDbContext context, AIService aiService, ILogger<AIController> logger)
        {
            _context = context;
            _aiService = aiService;
            _logger = logger;
        }

        [HttpPost("users/{userId}/analyze-cv")]
        public async Task<IActionResult> AnalyzeCV(int userId)
        {
            try
            {
                var cv = await _context.CVs.FirstOrDefaultAsync(c => c.UserId == userId);

                if (cv == null)
                {
                    _logger.LogWarning($"User with ID {userId} does not have a CV.");
                    return NotFound("CV bulunamadı.");
                }

                string filePath = cv.FilePath;
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
                _logger.LogError($"An error occurred while analyzing CV for user with ID {userId}: {ex.Message}");
                return StatusCode(500, "Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        }
    }
}
