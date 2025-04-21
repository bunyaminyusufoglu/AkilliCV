using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AkilliCVBackend.Data;
using AkilliCVBackend.Models;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;

namespace AkilliCVBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CvAnalysisController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CvAnalysisController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadCV(int userId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Dosya seçilmedi.");

            var uploadFolder = Path.Combine(_env.ContentRootPath, "UploadedFiles");

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            var filePath = Path.Combine(uploadFolder, file.FileName);

            var existingCV = await _context.CVs.FirstOrDefaultAsync(x => x.UserId == userId);
            if (existingCV != null)
            {
                if (System.IO.File.Exists(existingCV.FilePath))
                    System.IO.File.Delete(existingCV.FilePath);

                _context.CVs.Remove(existingCV);
                await _context.SaveChangesAsync();
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

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

        [HttpGet("view/{userId}")]
        public async Task<IActionResult> ViewCV(int userId)
        {
            var cv = await _context.CVs.FirstOrDefaultAsync(x => x.UserId == userId);

            if (cv == null)
                return NotFound(new { message = "CV bulunamadı." });

            return Ok(new
            {
                cv.Id,
                cv.UserId,
                cv.FileName,
                cv.FilePath,
                cv.UploadDate
            });
        }

        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> DeleteCV(int userId)
        {
            var cv = await _context.CVs.FirstOrDefaultAsync(x => x.UserId == userId);

            if (cv == null)
                return NotFound(new { message = "Silinecek CV bulunamadı." });

            if (System.IO.File.Exists(cv.FilePath))
            {
                System.IO.File.Delete(cv.FilePath);
            }

            _context.CVs.Remove(cv);
            await _context.SaveChangesAsync();

            return Ok(new { message = "CV başarıyla silindi." });
        }
    }
}
