namespace ProjectGrad_API.Services
{
    public class TopicValidationService
    {
        private readonly string[] _allowedKeywords =
        {
            "eye",
            "eyes",
            "vision",
            "retina",
            "retinal",
            "ophthalmology",
            "amd",
            "macular",
            "cataract",
            "stargardt",
            "rp",
            "retinitis",
            "myopia",
            "choroideremia",
            "cscr",
            "hypertensive retinopathy",
            "blindness",
            "visual impairment",
            "disease",
            "diseases"
        };

        public bool IsOphthalmologyQuestion(
            string question)
        {
            question = question.ToLower();

            foreach (var keyword in _allowedKeywords)
            {
                if (question.Contains(keyword))
                {
                    return true;
                }
            }
            
            return false;
        }
    }
}