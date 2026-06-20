namespace ProjectGrad_API.Models
{
    public class DocumentChunk
    {
        public int Id { get; set; }
        public string DiseaseName { get; set; } = "";
        public string SourceFile { get; set; } = "";
        public string Content { get; set; } = "";
        public string EmbeddingPath { get; set; } = "";
    }
}