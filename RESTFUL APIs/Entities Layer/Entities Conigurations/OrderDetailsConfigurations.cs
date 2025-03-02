using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class OrderDetailsConfigurations : IEntityTypeConfiguration<OrderDetails>
    {
        public void Configure(EntityTypeBuilder<OrderDetails> builder)
        {
            builder.HasKey(OrderDetails => OrderDetails.OrderDetailsId);
            builder.Property(OrderDetails => OrderDetails.OrderDetailsId).ValueGeneratedOnAdd();


            builder.Property(OrderDetails => OrderDetails.Quantity).HasColumnType("INT").IsRequired();

            builder.Property(OrderDetails => OrderDetails.UnitPrice).HasColumnType("DECIMAL").HasPrecision(10, 2).IsRequired();


            builder.HasOne(OrderDetails => OrderDetails.Order).WithMany(order => order.OrderDetails).HasForeignKey(orderDetails => orderDetails.OrderId).IsRequired().OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(OrderDetails => OrderDetails.ProductDetails).WithMany(ProductDetails => ProductDetails.OrdersDetails).HasForeignKey(orderDetails => orderDetails.ProductDetailsId).IsRequired().OnDelete(DeleteBehavior.NoAction);

            builder.HasIndex(OrderDetails => OrderDetails.OrderId).HasDatabaseName("IX_OrderDetails_OrderId");
            builder.HasIndex(OrderDetails => OrderDetails.ProductDetailsId).HasDatabaseName("IX_OrderDetails_ProductDetailsId");



            builder.ToTable("OrderDetails");
        }
    }

} 