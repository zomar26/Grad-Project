using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProjectGrad_API.Data;
using ProjectGrad_API.DTOs;
using ProjectGrad_API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using Microsoft.AspNetCore.RateLimiting;

namespace ProjectGrad_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableRateLimiting("Basic")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                Role = !string.IsNullOrEmpty(registerDto.Role) ? registerDto.Role : "User"
            };
            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok(new { message = "User registered successfully." });

        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO loginDTO)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == loginDTO.Email);

            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return Unauthorized("Invalid email or password.");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = jwt, message = "Login Success" });
        }

        [HttpPost("forget-password")]
        public IActionResult ForgetPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null)
            {
                return NotFound("User with this email does not exist.");
            }

            var random = new Random();
            string otpCode = random.Next(100000, 999999).ToString();

            var otpRecord = new OtpRecord
            {
                Email = dto.Email,
                Code = otpCode,
                ExpiryTime = DateTime.Now.AddMinutes(15),
                IsUsed = false
            };
            _context.OtpRecords.Add(otpRecord);
            _context.SaveChanges();

            try
            {
                var senderEmail = _configuration["EmailSettings:Email"];
                var senderPassword = _configuration["EmailSettings:Password"];

                var mail = new MailMessage();
                mail.From = new MailAddress(senderEmail);
                mail.To.Add(dto.Email);
                mail.Subject = "Password Reset OTP - Through The Eye";
                mail.Body = $"Your OTP for password reset is: {otpCode}. It is valid for 15 minutes.";

                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new System.Net.NetworkCredential(senderEmail, senderPassword),
                    EnableSsl = true,
                };
                smtpClient.Send(mail);
                return Ok(new { message = "OTP sent to email." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error sending OTP email.", error = ex.Message });
            }
        }
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpDto dto)
        {
            var otpRecord = _context.OtpRecords.Where(o => o.Email == dto.Email && o.Code == dto.OtpCode && !o.IsUsed)
                .OrderByDescending(o => o.ExpiryTime)
                .FirstOrDefault();

            if (otpRecord == null) return BadRequest("Invalid OTP.");

            if (otpRecord.ExpiryTime < DateTime.Now) return BadRequest("OTP has expired.");

            return Ok(new { message = "OTP verified successfully. You can now reset your password." });
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.OtpCode) || string.IsNullOrEmpty(dto.NewPassword))
            {
                return BadRequest("Email, OTP Code, and New Password are required.");
            }

            var otpRecord = _context.OtpRecords.Where(o => o.Email == dto.Email && o.Code == dto.OtpCode && !o.IsUsed)
                .OrderByDescending(o => o.ExpiryTime)
                .FirstOrDefault();

            if (otpRecord == null) return BadRequest("Invalid OTP.");

            if (otpRecord.ExpiryTime < DateTime.Now) return BadRequest("OTP has expired.");

            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null) return NotFound("User not found.");

            // Update user password hash
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            
            // Mark OTP as used
            otpRecord.IsUsed = true;

            _context.SaveChanges();

            return Ok(new { message = "Password reset successfully." });
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _configuration["Google:ClientId"] }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, settings);
                
                var user = _context.Users.FirstOrDefault(u => u.Email == payload.Email);
                if (user == null)
                {
                    user = new User
                    {
                        Email = payload.Email,
                        Name = payload.Name,
                        Role = "User",
                        PasswordHash = "GoogleLogin_NoPassword"
                    };
                    _context.Users.Add(user);
                    _context.SaveChanges();
                }

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                };
                
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );

                var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new {
                    message = "Google login successful.",
                    token = jwtToken,
                    username = user.Name,
                });
            }
            catch (InvalidJwtException)
            {
                return Unauthorized("Invalid Google ID token.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during Google login.", error = ex.Message });
            }
        }

    }
}
