using ProjectGrad_API.Models;

namespace ProjectGrad_API.Services
{
    public class DiseaseKnowledgeService
    {
        private readonly IWebHostEnvironment _env;
        private readonly List<DiseaseKnowledge> _diseases = new();
        public DiseaseKnowledgeService(IWebHostEnvironment env)
        {
            _env = env;
            LoadDiseases();
        }

        public IReadOnlyList<DiseaseKnowledge> GetAll()
        {
            return _diseases;
        }

        public DiseaseKnowledge? GetDisease(string name)
        {
            return _diseases.FirstOrDefault(d => d.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
        }

        private void LoadDiseases()
        {
            string diseasesPath = Path.Combine(
                _env.ContentRootPath,
                "DATA",
                "EyeDiseases"
            );

            if (!Directory.Exists(diseasesPath))
                return;

            foreach (var folder in Directory.GetDirectories(diseasesPath))
            {
                var disease = new DiseaseKnowledge();

                disease.Name = Path.GetFileName(folder);
                disease.Overview = ReadFile(folder, "overview.md");
                disease.Symptoms = ReadFile(folder, "symptoms.md");
                disease.Causes = ReadFile(folder, "causes.md");
                disease.Treatment = ReadFile(folder, "treatment.md");
                disease.DailyLife = ReadFile(folder, "daily_life.md");

                _diseases.Add(disease);
            }
        }

        private string ReadFile(string folder, string fileName)
        {
            string path = Path.Combine(folder, fileName);

            if (!File.Exists(path))
                return string.Empty;

            return File.ReadAllText(path);
        }
    }
}