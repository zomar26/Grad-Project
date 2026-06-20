namespace ProjectGrad_API.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int? ConversationId { get; set; }

        public string UserMessage { get; set; } = string.Empty;

        public string BotResponse { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public User? User { get; set; }

        public Conversation? Conversation { get; set; }

        public bool IsEdited { get; set; } = false;
        public string? OriginalUserMessage { get; set; }
        public DateTime? EditedAt { get; set; }
    }
}