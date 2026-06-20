using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;
using ProjectGrad_API.Data;
using ProjectGrad_API.Models;
using ProjectGrad_API.DTOs;

namespace ProjectGrad_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class VoiceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public VoiceController(
            ApplicationDbContext context,
            HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadVoice(
            IFormFile audio)
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

            if (
                audio == null ||
                audio.Length == 0
            )
            {
                return BadRequest(
                    "No audio file uploaded."
                );
            }

            WhisperResponseDto? whisperResponse =
                null;

            var uploadsFolder =
                Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "Uploads"
                );

            Directory.CreateDirectory(
                uploadsFolder
            );

            var fileName =
                Guid.NewGuid() +
                Path.GetExtension(
                    audio.FileName
                );

            var filePath =
                Path.Combine(
                    uploadsFolder,
                    fileName
                );

            // Save uploaded file
            using (
                var stream =
                    new FileStream(
                        filePath,
                        FileMode.Create
                    )
            )
            {
                await audio.CopyToAsync(
                    stream
                );
            }

            // Send file to Whisper
            using var formData =
                new MultipartFormDataContent();

            using var fileStream =
                System.IO.File.OpenRead(
                    filePath
                );

            formData.Add(
                new StreamContent(
                    fileStream
                ),
                "audio",
                fileName
            );

            var response =
    await _httpClient.PostAsync(
        "http://127.0.0.1:8000/transcribe",
        formData
    );

            var responseBody =
                await response
                    .Content
                    .ReadAsStringAsync();

            Console.WriteLine(
                $"Whisper Status: {response.StatusCode}"
            );

            Console.WriteLine(
                $"Whisper Response: {responseBody}"
            );

            response.EnsureSuccessStatusCode();

            var json = responseBody;

            whisperResponse =
                JsonConvert
                    .DeserializeObject<
                        WhisperResponseDto
                    >(json);

            // Save to database
            var voiceMessage =
                new VoiceMessage
                {
                    UserId = userId,

                    AudioFilePath =
                        filePath,

                    Transcript =
                        whisperResponse
                            ?.Transcript
                        ?? "",

                    CreatedAt =
                        DateTime.UtcNow,

                    Processed = true
                };

            _context.VoiceMessages.Add(
                voiceMessage
            );

            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    transcript =
                        whisperResponse
                            ?.Transcript
                }
            );
        }
    }
}