using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.IO;
using Newtonsoft.Json;

namespace AkilliCVBackend.Services
{
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public AIService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["Gemini:ApiKey"];
        }

        public async Task<string> AnalyzeCVAsync(string filePath, string analysisText)
        {
            if (!File.Exists(filePath))
                return "CV dosyası bulunamadı.";

            var promptText = analysisText;

            // Gemini API endpoint
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}";

            // JSON payload
            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = promptText }
                        }
                    }
                }
            };

            var jsonPayload = JsonConvert.SerializeObject(payload);
            var httpContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, httpContent);

            if (!response.IsSuccessStatusCode)
            {
                return $"Gemini API hatası: {response.StatusCode} - {response.ReasonPhrase}";
            }

            var responseString = await response.Content.ReadAsStringAsync();
            return responseString;
        }
    }
}
