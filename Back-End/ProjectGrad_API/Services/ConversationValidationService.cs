namespace ProjectGrad_API.Services
{
    public class ConversationValidationService
    {
        private readonly string[] _ophthalmologyTerms =
        {
            "eye",
            "eyes",
            "vision",
            "retina",
            "retinal",
            "amd",
            "macular",
            "cataract",
            "myopia",
            "stargardt",
            "retinitis",
            "rp",
            "choroideremia",
            "cscr",
            "hypertensive retinopathy",
            "ophthalmology",
            "blindness",
            "visual"
        };

        public bool IsOphthalmologyQuestion(string question)
        {
            question = question.ToLower();

            return _ophthalmologyTerms.Any(term => question.Contains(term));
        }

        public bool IsFollowUpQuestion(string question)
        {
            question = question.ToLower();

            return
                question.Contains("it") ||
                question.Contains("its") ||
                question.Contains("they") ||
                question.Contains("them") ||
                question.Contains("this disease") ||
                question.Contains("that disease") ||
                question.Contains("this condition") ||
                question.Contains("that condition");
        }
    }
}