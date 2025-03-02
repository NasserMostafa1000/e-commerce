using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public class UsersConfigurations : IEntityTypeConfiguration<Users>
    {
        public void Configure(EntityTypeBuilder<Users> builder)
        {
            builder.HasKey(user => user.UserId);
            builder.Property(user => user.UserId).ValueGeneratedOnAdd();

            // جعل البريد الإلكتروني فريدًا
            builder.Property(user => user.EmailOrAuthId)
                .HasColumnType("VARCHAR")
                .HasMaxLength(250)
                .IsRequired();

            builder.HasIndex(user => user.EmailOrAuthId)  
                .IsUnique();

            builder.Property(user => user.RoleId).HasColumnType("TINYINT").IsRequired();


            builder.Property(user => user.AuthProvider).HasColumnType("VARCHAR").HasMaxLength(85);

            builder.Property(user => user.CreatedAt).HasColumnType("DATETIME");
            builder.Property(user => user.CreatedAt).HasDefaultValueSql("SYSDATETIMEOFFSET() AT TIME ZONE 'Egypt Standard Time'");

            builder.Property(user => user.Salt).HasColumnType("VARCHAR").HasMaxLength(255);
            builder.Property(user => user.PasswordHash).HasColumnType("VARCHAR").HasMaxLength(100);

            builder.HasOne(user => user.Client).WithOne(Client => Client.User).HasForeignKey<Client>(client => client.UserId).IsRequired(false);
            builder.ToTable("Users");
        }
    }
}

