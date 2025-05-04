using System.Net.Http;
using System.Threading.Tasks;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace AkilliCVBackend.Services
{
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public AIService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["Gemini:ApiKey"]; // API key'inizi appsettings.json veya env'den alın
        }

        public async Task<string> AnalyzeCVAsync(string filePath, string analysisText)
        {
            if (!File.Exists(filePath))
                return "CV dosyası bulunamadı.";

            using var fileStream = File.OpenRead(filePath);
            var content = new MultipartFormDataContent
            {
                { new StreamContent(fileStream), "file", Path.GetFileName(filePath) },
                { new StringContent(analysisText), "text" } // Metni de ekliyoruz
            };

            // Header'a API key ekleniyor (önceden varsa ekleme)
            if (!_httpClient.DefaultRequestHeaders.Contains("Authorization"))
            {
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            }

            var response = await _httpClient.PostAsync("https://api.gemini.com/v1/cv-analyze", content);

            if (!response.IsSuccessStatusCode)
            {
                return $"CV analizi başarısız oldu. Hata: {response.ReasonPhrase}";
            }

            var responseData = await response.Content.ReadAsStringAsync();
            return responseData;
        }
    }
}
