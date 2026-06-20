using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectGrad_API.Data;
using ProjectGrad_API.DTOs;
using ProjectGrad_API.Models;
using System.Security.Claims;

namespace ProjectGrad_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class VRController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VRController(
            ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("session")]
        public async Task<IActionResult> SaveSession(
            SaveVRSessionDto dto)
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

            if (
                string.IsNullOrEmpty(
                    userIdClaim
                )
            )
            {
                return Unauthorized();
            }

            int userId =
                int.Parse(
                    userIdClaim
                );

            var session =
                new VRSession
                {
                    UserId = userId,

                    DiseaseName =
                        dto.DiseaseName,

                    SeverityLevel =
                        dto.SeverityLevel,

                    CreatedAt =
                        DateTime.UtcNow
                };

            _context.VRSessions.Add(
                session
            );

            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    message =
                        "Session saved"
                }
            );
        }
    }
}