using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ProjectGrad_API.DTOs;
using ProjectGrad_API.Services;
using ProjectGrad_API.Data;
using ProjectGrad_API.Models;

namespace ProjectGrad_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatbotService _chatbotService;
        private readonly ApplicationDbContext _context;

        public ChatController(
            ChatbotService chatbotService,
            ApplicationDbContext context)
        {
            _chatbotService = chatbotService;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Chat(
            [FromBody] ChatRequestDto request)
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            int userId =
                int.Parse(userIdClaim);

            var response =
                await _chatbotService.AskAsync(
                    request.Message,
                    userId,
                    request.ConversationId
                );

            if (request.ConversationId.HasValue)
            {
                var conversation =
                    await _context.Conversations
                        .FindAsync(
                            request.ConversationId.Value
                        );

                if (
                    conversation != null &&
                    conversation.Title == "New Chat"
                )
                {
                    conversation.Title =
                        await _chatbotService
                            .GenerateTitleAsync(
                                request.Message
                            );

                    await _context.SaveChangesAsync();
                }
            }

            var latestMessage =
    await _context.ChatMessages
        .Where(c => c.UserId == userId)
        .OrderByDescending(c => c.Id)
        .FirstOrDefaultAsync();

            return Ok(
                new ChatResponseDto
                {
                    MessageId =
                        latestMessage?.Id ?? 0,

                    Response = response,

                    Source =
                        "Disease Knowledge Base"
                }
            );
        }

        // ==========================
        // CREATE CONVERSATION
        // ==========================
        [HttpPost("conversation")]
        public async Task<IActionResult> CreateConversation(
            [FromBody] CreateConversationDto dto)
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            int userId =
                int.Parse(userIdClaim);

            var conversation =
                new Conversation
                {
                    UserId = userId,
                    Title = dto.Title,
                    CreatedAt = DateTime.UtcNow
                };

            _context.Conversations.Add(
                conversation
            );

            await _context.SaveChangesAsync();

            return Ok(
                new ConversationDto
                {
                    Id = conversation.Id,
                    Title = conversation.Title,
                    CreatedAt = conversation.CreatedAt
                }
            );
        }

        // ==========================
        // GET ALL CONVERSATIONS
        // ==========================
        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            int userId =
                int.Parse(userIdClaim);

            var conversations =
                await _context.Conversations
                    .Where(c => c.UserId == userId)
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new ConversationDto
                    {
                        Id = c.Id,
                        Title = c.Title,
                        CreatedAt = c.CreatedAt
                    })
                    .ToListAsync();

            return Ok(conversations);
        }

        // ==========================
        // GET ONE CONVERSATION
        // ==========================
        [HttpGet("conversation/{id}")]
        public async Task<IActionResult> GetConversation(
            int id)
        {
            var messages =
                await _context.ChatMessages
                    .Where(m =>
                        m.ConversationId == id)
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new
                    {
                        m.Id,
                        m.UserMessage,
                        m.BotResponse,
                        m.CreatedAt
                    })
                    .ToListAsync();

            return Ok(messages);
        }

        // ==========================
        // OLD HISTORY ENDPOINT
        // ==========================
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            int userId =
                int.Parse(userIdClaim);

            var history =
                await _context.ChatMessages
                    .Where(c => c.UserId == userId)
                    .OrderBy(c => c.CreatedAt)
                    .Select(c => new
                    {
                        c.UserMessage,
                        c.BotResponse,
                        c.CreatedAt
                    })
                    .ToListAsync();

            return Ok(history);
        }


        // ==========================
        // MESSAGE COUNT
        // ==========================
        [HttpGet("count")]
        public IActionResult Count()
        {
            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            int userId =
                int.Parse(userIdClaim);

            var count =
                _context.ChatMessages
                    .Count(c => c.UserId == userId);

            return Ok(new
            {
                Count = count
            });
        }

        [HttpPut("conversation/{id}/title")]
        public async Task<IActionResult> UpdateTitle(
    int id,
    [FromBody] string title)
        {
            var conversation =
                await _context.Conversations
                    .FindAsync(id);

            if (conversation == null)
            {
                return NotFound();
            }

            conversation.Title = title;

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("conversation/{id}")]
        public async Task<IActionResult> DeleteConversation(
            int id)
        {
            var conversation =
                await _context.Conversations
                    .Include(c => c.Messages)
                    .FirstOrDefaultAsync(
                        c => c.Id == id
                    );

            if (conversation == null)
            {
                return NotFound();
            }

            _context.ChatMessages.RemoveRange(
                conversation.Messages
            );

            _context.Conversations.Remove(
                conversation
            );

            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPut("message/edit")]
        public async Task<IActionResult>
        EditMessage(
            [FromBody]
    EditMessageDto dto
        )
        {
            Console.WriteLine(
            $"EDIT HIT -> Id={dto.MessageId}, Text={dto.NewMessage}"
        );

            var message =
                await _context.ChatMessages
                    .FindAsync(
                        dto.MessageId
                    );

            if (message == null)
            {
                return NotFound();
            }

            if (!message.IsEdited)
            {
                message.OriginalUserMessage =
                    message.UserMessage;
            }

            message.UserMessage =
                dto.NewMessage;

            message.IsEdited = true;

            message.EditedAt =
                DateTime.UtcNow;

            var newAnswer =
                await _chatbotService
                    .RegenerateAnswerAsync(
                        dto.NewMessage,
                        message.UserId
                    );

            message.BotResponse =
                newAnswer;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                answer = newAnswer
            });
        }
    }
}