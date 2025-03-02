using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class PaymenstMethodsConfigurations : IEntityTypeConfiguration<PaymentsMethods>
    {
        public void Configure(EntityTypeBuilder<PaymentsMethods> builder)
        {
            builder.HasKey(PaymentMethod => PaymentMethod.MethodId);
            builder.Property(PaymentMethod => PaymentMethod.MethodId).ValueGeneratedOnAdd();


            builder.Property(PaymentMethod => PaymentMethod.MethodId).HasColumnType("TINYINT").IsRequired();

            builder.Property(PaymentMethod => PaymentMethod.Method)
                   .HasColumnType("NVARCHAR")
                   .HasMaxLength(50)
                   .IsRequired();

            builder.ToTable("PaymentMethods");

             builder.HasData(
                new PaymentsMethods { MethodId = 1, Method = "المحفظة الإلكترونية" },
                new PaymentsMethods { MethodId = 2, Method = "الدفع عند الاستلام" }
            );
        }
    }
}
