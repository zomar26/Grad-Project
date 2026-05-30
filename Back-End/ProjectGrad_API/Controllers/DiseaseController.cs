using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectGrad_API.Data;
using ProjectGrad_API.Models;

namespace ProjectGrad_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiseaseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public DiseaseController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public IActionResult GetDiseases()
        {
            var diseases = _context.Diseases.ToList();
            return Ok(diseases);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public IActionResult GetDiseaseById(int id)
        {
            var disease = _context.Diseases.Find(id);
            if (disease == null)
            {
                return NotFound();
            }
            return Ok(disease);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Create([FromBody] Disease disease)
        {
            if (disease == null)
            {
                return BadRequest();
            }
            _context.Diseases.Add(disease);
            _context.SaveChanges();
            return Ok(new { message = "Disease created successfully" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Update(int id, [FromBody] Disease updatedDisease)
        {
            var disease = _context.Diseases.Find(id);
            if (disease == null)
            {
                return NotFound();
            }
            disease.Name = updatedDisease.Name;
            disease.Description = updatedDisease.Description;
            disease.Symptoms = updatedDisease.Symptoms;
            _context.SaveChanges();
            return Ok(new { message = "Disease updated successfully" });
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            var disease = _context.Diseases.Find(id);
            if (disease == null)
            {
                return NotFound();
            }
            _context.Diseases.Remove(disease);
            _context.SaveChanges();
            return Ok(new { message = "Disease deleted successfully" });
        }
    }
}
