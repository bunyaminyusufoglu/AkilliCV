using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;

namespace AkilliCVBackend.Services
{
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = "YOUR_API_KEY"; // DeepAI API anahtarınızı buraya ekleyin

        public AIService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // CV analizini yapan metod
        public async Task<string> AnalyzeCVAsync(string filePath)
        {
            var content = new MultipartFormDataContent();
            content.Add(new StringContent(filePath), "file");

            // API anahtarını başlıklara ekleyin
            _httpClient.DefaultRequestHeaders.Add("api-key", _apiKey);

            // API'ye POST isteği gönderin
            var response = await _httpClient.PostAsync("https://api.deepai.org/api/resume-analyzer", content);

            if (!response.IsSuccessStatusCode)
            {
                return "CV analizi başarısız oldu.";
            }

            // API'den gelen yanıtı JSON formatında çözümleyin
            var responseData = await response.Content.ReadAsStringAsync();
            return responseData; // JSON formatında analiz sonucu dönecek
        }
    }
}
