using Newtonsoft.Json;
using System.Text;
using System.Text.RegularExpressions;

namespace ProjectGrad_API.Services
{
    public class VectorSearchService
    {
        private readonly HttpClient _httpClient;

        public VectorSearchService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        private string SanitizeContent(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
            {
                return string.Empty;
            }

            string cleaned = content;

            cleaned = Regex.Replace(
                cleaned,
                @"[A-Za-z]:\\[^\s]+",
                "[REDACTED_PATH]"
            );

            cleaned = Regex.Replace(
                cleaned,
                @"https?:\/\/\S+",
                "[REDACTED_URL]"
            );

            cleaned = cleaned.Replace(
                "ignore previous instructions",
                "[REDACTED]",
                StringComparison.OrdinalIgnoreCase
            );

            cleaned = cleaned.Replace(
                "system prompt",
                "[REDACTED]",
                StringComparison.OrdinalIgnoreCase
            );

            cleaned = cleaned.Replace(
                "developer prompt",
                "[REDACTED]",
                StringComparison.OrdinalIgnoreCase
            );

            cleaned = cleaned.Replace(
                "ignore all instructions",
                "[REDACTED]",
                StringComparison.OrdinalIgnoreCase
            );

            cleaned = cleaned.Replace(
                "act as",
                "[REDACTED]",
                StringComparison.OrdinalIgnoreCase
            );

            cleaned = cleaned.Replace(
                "you are now",
                "[REDACTED]",
                StringComparison.OrdinalIgnoreCase
            );

            return cleaned;
        }

        public async Task<string> SearchAsync(string question)
        {
            var body = new
            {
                query = question
            };

            var response =
                await _httpClient.PostAsync(
                    "http://127.0.0.1:8000/search",
                    new StringContent(
                        JsonConvert.SerializeObject(body),
                        Encoding.UTF8,
                        "application/json"
                    )
                );

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
               
            dynamic result = JsonConvert.DeserializeObject(json)!;

            if (result.results.Count == 0)
            {
                return string.Empty;
            }

            StringBuilder sb = new StringBuilder();

            int count = 0;

            foreach (var chunk in result.results)
            {
                if (count >= 3)
                {
                    break;
                }

                string content = chunk.content.ToString();
                  
                if (content.Length > 1500) 
                {
                    content = content.Substring(0, 1500);
                }

                content = SanitizeContent(content);

                sb.AppendLine($"Disease: {chunk.disease}");
                sb.AppendLine(content);
                sb.AppendLine();

                count++;
            }

            return sb.ToString();
        }
    }
}