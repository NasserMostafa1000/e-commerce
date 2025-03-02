using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public class AddressesConfigurations : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.HasKey(Address => Address.AddressId);
            builder.Property(Address => Address.AddressId).ValueGeneratedOnAdd();

            builder.Property(Address => Address.City).HasColumnType("NVARCHAR").HasMaxLength(50).IsRequired();

            builder.Property(Address => Address.Governorate).HasColumnType("NVARCHAR").HasMaxLength(50).IsRequired();

            builder.Property(Address => Address.St).HasColumnType("NVARCHAR").HasMaxLength(50).IsRequired();
            builder.ToTable("ClientsAddresses");
        }

    }
}
