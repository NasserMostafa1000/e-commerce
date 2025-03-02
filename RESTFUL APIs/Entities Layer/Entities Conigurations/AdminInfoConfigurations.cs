using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class AdminInfoConfigurations : IEntityTypeConfiguration<AdminInfo>
    {
        public void Configure(EntityTypeBuilder<AdminInfo> builder)
        {
            builder.HasKey(WebsiteInfo => WebsiteInfo.Id);
            builder.Property(WebsiteInfo => WebsiteInfo.Id).ValueGeneratedOnAdd();



            builder.Property(WebsiteInfo => WebsiteInfo.Id).HasColumnType("TINYINT").IsRequired();



            builder.Property(WebsiteInfo => WebsiteInfo.TransactionNumber)
                   .HasColumnType("NVARCHAR")
                   .HasMaxLength(20)
                   .IsRequired();


            builder.Property(WebsiteInfo => WebsiteInfo.WhatsAppNumber)
                   .HasColumnType("NVARCHAR")
                   .HasMaxLength(20)
                   .IsRequired();

            builder.Property(WebsiteInfo => WebsiteInfo.PhoneNumber)
                   .HasColumnType("NVARCHAR")
                   .HasMaxLength(20)
                   .IsRequired();

            builder.Property(WebsiteInfo => WebsiteInfo.Email)
                   .HasColumnType("NVARCHAR")
                   .HasMaxLength(150)
                   .IsRequired();
            builder.HasData(
                new AdminInfo
                {
                    Id = 1,
                    TransactionNumber = "1234567890",
                    WhatsAppNumber = "+201234567890",
                    PhoneNumber = "+201098765432",
                    Email = "info@website.com"
                }
            );

            builder.ToTable("AdminInfo");
        }
    }
}
