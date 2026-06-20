using Microsoft.EntityFrameworkCore;
using ProjectGrad_API.Models;

namespace ProjectGrad_API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Disease> Diseases { get; set; }

        public DbSet<OtpRecord> OtpRecords { get; set; }
        public DbSet<VRSession> VRSessions { get; set; }

        public DbSet<ChatMessage> ChatMessages { get; set; }

        public DbSet<VoiceMessage> VoiceMessages => Set<VoiceMessage>();

        public DbSet<DocumentChunk> DocumentChunks { get; set; }

        // NEW
        public DbSet<Conversation> Conversations { get; set; }

        protected override void OnModelCreating(
            ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Conversation>()
                .HasMany(c => c.Messages)
                .WithOne(m => m.Conversation)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}