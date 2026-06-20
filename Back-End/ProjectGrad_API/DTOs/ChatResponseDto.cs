namespace ProjectGrad_API.DTOs
{
    public class ChatResponseDto
    {
        public int MessageId { get; set; }
        public string Response { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
    }
}