namespace ProjectGrad_API.Services
{
    public class EmbeddingService
    {
        public Task<float[]> CreateEmbeddingAsync(string text)
        {
            return Task.FromResult(Array.Empty<float>());
        }
    }
}