namespace ProjectGrad_API.DTOs
{
    public class ChatRequestDto
    {
        public string Message { get; set; } = string.Empty;
        public int? ConversationId { get; set; }
        public List<string>? PreviousMessages { get; set; }
    }
}