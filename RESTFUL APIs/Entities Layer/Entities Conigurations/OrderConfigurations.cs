using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class OrderConfigurations : IEntityTypeConfiguration<Orders>
    {
        public void Configure(EntityTypeBuilder<Orders> builder)
        {
            builder.HasKey(Order => Order.OrderId);
            builder.Property(Order => Order.OrderId).ValueGeneratedOnAdd();


            builder.Property(Order => Order.CreatedAt).HasColumnType("DATETIME");
            builder.Property(Order => Order.CreatedAt).HasDefaultValueSql("SYSDATETIMEOFFSET() AT TIME ZONE 'Egypt Standard Time'");

            builder.Property(Order => Order.TotalAmount).HasColumnType("DECIMAL").HasPrecision(10, 2).IsRequired();
            builder.Property(Order => Order.ShippingCoast).HasColumnType("DECIMAL").HasPrecision(10, 2).IsRequired();
            builder.Property(Order => Order.OrderStatusId) .HasColumnType("TINYINT").IsRequired();
            builder.Property(Address => Address.Address).HasColumnType("NVARCHAR").HasMaxLength(350).IsRequired();


            builder.Property(Order => Order.TransactionNumber).HasColumnType("NVARCHAR").HasMaxLength(20).IsRequired(false);
            builder.Property(Order => Order.RejectionReason).HasColumnType("NVARCHAR").HasMaxLength(1000).IsRequired(false);
            builder.Property(Order => Order.PaymentMethodId).HasColumnType("TINYINT").IsRequired();


            builder.HasMany(Order => Order.OrderDetails).WithOne(OrderDetails => OrderDetails.Order).HasForeignKey(OrderDetails => OrderDetails.OrderId).IsRequired();

            builder.HasOne(order => order.OrderStatus).WithMany(orderStatus => orderStatus.Orders).HasForeignKey(Order => Order.OrderStatusId).IsRequired();

            builder.HasOne(order => order.Client).WithMany(client => client.Orders).HasForeignKey(order => order.ClientId).IsRequired();
            builder.HasOne(order => order.PaymentMethod).WithMany(paymentMethod => paymentMethod.Orders).HasForeignKey(Order => Order.PaymentMethodId).IsRequired();
            builder.HasIndex(order => order.ClientId).HasDatabaseName("IX_Orders_ClientId");

            builder.ToTable("Orders");
        }
    }

} 