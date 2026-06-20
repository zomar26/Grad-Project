namespace ProjectGrad_API.Models
{
    public class VoiceMessage
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? ConversationId { get; set; }
        public string AudioFilePath { get; set; } = string.Empty;
        public string Transcript { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool Processed { get; set; }
    }
}