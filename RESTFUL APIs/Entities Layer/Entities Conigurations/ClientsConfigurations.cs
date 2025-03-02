using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public class ClientsConfigurations:IEntityTypeConfiguration<Client>
    {
        public void Configure(EntityTypeBuilder<Client> builder)
        {
            builder.HasKey(Client => Client.ClientId);
            builder.Property(Client => Client.ClientId).ValueGeneratedOnAdd();


            builder.Property(Client => Client.PhoneNumber).IsRequired(false);
            builder.Property(Client => Client.PhoneNumber) .HasColumnType("NVARCHAR").HasMaxLength(50);

            builder.Property(Client => Client.FirstName).HasColumnName("FirstName").HasColumnType("NVARCHAR").HasMaxLength(25).IsRequired();
            builder.Property(Client => Client.SecondName).HasColumnName("SecondName").HasColumnType("NVARCHAR").HasMaxLength(25).IsRequired();


            builder.ToTable("Clients");
            builder.HasIndex(Client => Client.UserId).HasDatabaseName("IX_Clients_UserId");


            builder.HasMany(Client => Client.Addresses).WithOne(Address => Address.Client).HasForeignKey(Address => Address.ClientId).IsRequired();

        }
    }
}
