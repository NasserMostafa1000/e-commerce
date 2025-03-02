using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class OrderStatusConfigurations : IEntityTypeConfiguration<OrderStatus>
    {
        public void Configure(EntityTypeBuilder<OrderStatus> builder)
        {
            builder.HasKey(OrderStatus => OrderStatus.OrderStatusId);
            builder.Property(OrderStatus => OrderStatus.OrderStatusId).ValueGeneratedOnAdd();

            builder.Property(OrderStatus => OrderStatus.OrderStatusId).HasColumnType("TINYINT").IsRequired();


            builder.Property(OrderStatus => OrderStatus.StatusName)
                   .HasColumnType("NVARCHAR")
                   .HasMaxLength(50)
                   .IsRequired();

            builder.ToTable("OrderStatus");

            // إضافة بيانات مبدئية
            builder.HasData(
                new OrderStatus { OrderStatusId = 1,StatusName = "قيد المعالجة" },
                new OrderStatus { OrderStatusId = 2,StatusName = "تم التأكيد" },
                new OrderStatus { OrderStatusId = 3,StatusName = "قيد الشحن" },
                new OrderStatus { OrderStatusId = 4,StatusName = "تم التوصيل" },
                new OrderStatus { OrderStatusId = 5,StatusName = "تم الإلغاء" },
                new OrderStatus { OrderStatusId = 6,StatusName = "تم الإرجاع" },
                new OrderStatus { OrderStatusId = 7,StatusName = "تم الرفض" }

            );
        }
    }
}
