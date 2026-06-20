namespace ProjectGrad_API.Models
{
    public class Conversation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public User? User { get; set; }
        public ICollection<ChatMessage> Messages = new List<ChatMessage>();
    }
}