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
            "amd",
            "AMD",
            "traumatic",
            "pigmentosa",
            "cortical",
            "cortical cataract",
            "pucker",
            "macular",
            "posterior",
            "nuclear cataract",
            "nuclear",
            "myopia",
            "stargardt",
            "retinitis",
            "rp",
            "choroideremia",
            "cscr",
            "hypertensive",
            "hypertensive retinopathy",
            "ophthalmology",
            "blindness",
            "conditions",
            "condition",
            "disease",
            "diseases",
            "visual"
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