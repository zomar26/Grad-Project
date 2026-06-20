namespace ProjectGrad_API.Models
{
    public class VRSession
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string DiseaseName { get; set; }
            = string.Empty;

        public int SeverityLevel { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}