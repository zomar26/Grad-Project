namespace ProjectGrad_API.DTOs
{
    public class EditMessageDto
    {
        public int MessageId { get; set; }
        public string NewMessage { get; set; } = string.Empty;
    }
}