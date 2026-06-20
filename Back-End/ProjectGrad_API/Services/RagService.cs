using System.Text;

namespace ProjectGrad_API.Services
{
    public class RagService
    {
        private readonly IWebHostEnvironment _env;
        public RagService(IWebHostEnvironment env)

        { _env = env;}

        public async Task<string> GetContextAsync(string question)
        {
            string diseasesPath = Path.Combine(
                _env.ContentRootPath,
                "Data",
                "EyeDiseases"
            );

            if (!Directory.Exists(diseasesPath))
                return "Knowledge base not found.";

            string? diseaseFolder = DetectDisease(question);

            if (diseaseFolder != null)
            {
                string targetFolder = Path.Combine(diseasesPath, diseaseFolder);
                   

                if (Directory.Exists(targetFolder))
                {
                    return await LoadFolderContent(targetFolder, question);
                }
            }

            return await LoadGeneralKnowledge(diseasesPath);
        }

        private string? DetectDisease(string question)
        {
            question = question.ToLower();

            if (question.Contains("amd") ||
            question.Contains("age related macular degeneration") ||
            question.Contains("age-related macular degeneration"))
                return "amd";

            if (question.Contains("myopia") ||
            question.Contains("Pathologic Myopia"))
                return "myopia";

            if (question.Contains("choroideremia"))
                return "choroideremia";

            if (question.Contains("cscr") ||
            question.Contains("acute central serous chorioretinopathy"))
                return "cscr";

            if (question.Contains("hypertensive") ||
            question.Contains("hypertensive retinopathy,"))
                return "hypertensive";

            if (question.Contains("nuclear cataract"))
                return "nuclear_cataract";

            if (question.Contains("posterior cataract") ||
            question.Contains("posterior subcapsular cataract"))
                return "posterior_cataract";

            if (question.Contains("cortical cataract"))
                return "cortical_cataract";

            if (question.Contains("traumatic cataract"))
                return "traumatic_cataract";

            if (question.Contains("pucker") ||
            question.Contains("macular pucker") ||
            question.Contains("epiretinal membrane"))
                return "pucker";

            if (question.Contains("retinitis pigmentosa") ||
                question.Contains("rp"))
                return "rp";

            if (question.Contains("stargardt"))
                return "stargardt";

            return null;
        }

        private async Task<string> LoadFolderContent(string folder, string question)
        {
            string fileName = "overview.md";
            string q = question.ToLower();

            if (q.Contains("symptom"))
                fileName = "symptoms.md";

            else if (q.Contains("cause"))
                fileName = "causes.md";

            else if (q.Contains("treat"))
                fileName = "treatment.md";

            else if (q.Contains("daily"))
                fileName = "daily_life.md";

            string filePath = Path.Combine(folder, fileName);

            if (File.Exists(filePath))
            {
                return await File.ReadAllTextAsync(filePath);
            }
            return await File.ReadAllTextAsync(Path.Combine(folder, "overview.md"));
        }

        private async Task<string> LoadGeneralKnowledge(
            string diseasesPath)
        {
            var builder = new StringBuilder();

            var files = Directory.GetFiles(
                diseasesPath,
                "*.md",
                SearchOption.AllDirectories
            );

            foreach (var file in files.Take(10))
            {
                builder.AppendLine(await File.ReadAllTextAsync(file));
            }

            return builder.ToString();
        }
    }

}
