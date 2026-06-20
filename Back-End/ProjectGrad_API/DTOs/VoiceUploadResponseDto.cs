namespace ProjectGrad_API.DTOs
{
    public class VoiceUploadResponseDto
    {
        public string Transcript { get; set; } = string.Empty;
        public int VoiceMessageId { get; set; }
    }
}