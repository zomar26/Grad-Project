namespace ProjectGrad_API.Services
{
    public class PromptInjectionService
    {
        private readonly string[] _blockedPatterns =
        {
            "ignore previous instructions",
            "ignore all instructions",
            "ignore prior instructions",
            "forget your instructions",
            "forget previous instructions",
            "system prompt",
            "developer prompt",
            "reveal prompt",
            "show prompt",
            "act as",
            "you are now",
            "pretend to be",
            "roleplay",
            "jailbreak",
            "bypass",
            "override instructions",
            "simulate another assistant",
            "simulate chatgpt",
            "simulate claude",
            "simulate gemini"
        };

        public bool IsPromptInjection(string text)
            
        {
            text = text.ToLower();

            foreach (var pattern in _blockedPatterns)
            {
                if (text.Contains(pattern))

                {return true;}
            }
            return false;
        }
    }
}