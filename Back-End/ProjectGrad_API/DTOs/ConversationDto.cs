namespace ProjectGrad_API.DTOs
{
    public class ConversationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}