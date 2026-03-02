using Microsoft.AspNetCore.Http;
using ProjectGrad_API.Data;
using ProjectGrad_API.DTOs;
using Microsoft.AspNetCore.Mvc;
using ProjectGrad_API.Models;
using System.Linq;

namespace ProjectGrad_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto registerDto)
        {
            if (string.IsNullOrEmpty(registerDto.Email) || string.IsNullOrEmpty(registerDto.Password))
            {
                return BadRequest("Email and Password are required.");
            }
            var userExist = _context.Users.Any(u => u.Email == registerDto.Email);
            if (userExist) {
                return BadRequest("User with this email already exists.");
            }

            string hashPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            var newUser = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = hashPassword,
                Role = "User"
            };
            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok(new { message = "User registered successfully." });

        }

    }
}
