using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AkilliCVBackend.Data;
using AkilliCVBackend.Models;
using System.IO;
using System.Threading.Tasks;

namespace AkilliCVBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CVController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CVController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadCV(int userId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Dosya seçilmedi.");

            var filePath = Path.Combine(_env.ContentRootPath, "UploadedFiles", file.FileName);

            // Dosyayı kaydet
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Veritabanına kaydet
            var cv = new CV
            {
                UserId = userId,
                FilePath = filePath,
                FileName = file.FileName,
                UploadDate = DateTime.Now
            };

            _context.CVs.Add(cv);
            await _context.SaveChangesAsync();

            return Ok(new { message = "CV başarıyla yüklendi.", filePath });
        }
    }
}
