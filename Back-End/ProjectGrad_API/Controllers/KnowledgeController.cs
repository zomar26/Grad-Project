using Microsoft.AspNetCore.Mvc;
using ProjectGrad_API.Services;

namespace ProjectGrad_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KnowledgeController : ControllerBase
    {
        private readonly DiseaseKnowledgeService _service;

        public KnowledgeController(
            DiseaseKnowledgeService service)
        {
            _service = service;
        }

        [HttpGet("diseases")]
        public IActionResult GetDiseases()
        {
            return Ok(
                _service
                .GetAll()
                .Select(d => d.Name)
            );
        }

        [HttpGet("{name}")]
        public IActionResult GetDisease(string name)
        {
            var disease =
                _service.GetDisease(name);

            if (disease == null)
                return NotFound();

            return Ok(disease);
        }
    }
}