using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public class ShippingCoastsConfigurations : IEntityTypeConfiguration<ShippingCoasts>
    {
        public void Configure(EntityTypeBuilder<ShippingCoasts> builder)
        {
            builder.HasKey(sp => sp.Id);
            builder.Property(sp => sp.Id)
                   .HasColumnType("TINYINT");

            builder.Property(sp => sp.Price)
                   .HasColumnType("DECIMAL")
                   .HasPrecision(10, 2)
                   .IsRequired();

            builder.Property(sp => sp.GovernorateName)
                   .HasColumnType("NVARCHAR")
                   .HasMaxLength(55);

            // تحميل البيانات الوهمية لجميع المحافظات المصرية
            builder.HasData(LoadData());
        }

        private ShippingCoasts[] LoadData()
        {
            return new ShippingCoasts[]
            {
                new ShippingCoasts { Id = 1, GovernorateName = "القاهرة",         Price = 50.00m },
                new ShippingCoasts { Id = 2, GovernorateName = "الجيزة",          Price = 55.00m },
                new ShippingCoasts { Id = 3, GovernorateName = "الإسكندرية",      Price = 60.00m },
                new ShippingCoasts { Id = 4, GovernorateName = "القليوبية",       Price = 45.00m },
                new ShippingCoasts { Id = 5, GovernorateName = "الغربية",         Price = 48.00m },
                new ShippingCoasts { Id = 6, GovernorateName = "الشرقية",         Price = 52.00m },
                new ShippingCoasts { Id = 7, GovernorateName = "الدقهلية",        Price = 50.00m },
                new ShippingCoasts { Id = 8, GovernorateName = "البحيرة",         Price = 58.00m },
                new ShippingCoasts { Id = 9, GovernorateName = "المنوفية",        Price = 47.00m },
                new ShippingCoasts { Id = 10, GovernorateName = "بني سويف",        Price = 53.00m },
                new ShippingCoasts { Id = 11, GovernorateName = "الفيوم",          Price = 49.00m },
                new ShippingCoasts { Id = 12, GovernorateName = "المنيا",          Price = 55.00m },
                new ShippingCoasts { Id = 13, GovernorateName = "سوهاج",           Price = 57.00m },
                new ShippingCoasts { Id = 14, GovernorateName = "أسيوط",           Price = 56.00m },
                new ShippingCoasts { Id = 15, GovernorateName = "قنا",             Price = 60.00m },
                new ShippingCoasts { Id = 16, GovernorateName = "الأقصر",          Price = 65.00m },
                new ShippingCoasts { Id = 17, GovernorateName = "أسوان",           Price = 68.00m },
                new ShippingCoasts { Id = 18, GovernorateName = "دمياط",           Price = 62.00m },
                new ShippingCoasts { Id = 19, GovernorateName = "بورسعيد",         Price = 58.00m },
                new ShippingCoasts { Id = 20, GovernorateName = "الإسماعيلية",      Price = 55.00m },
                new ShippingCoasts { Id = 21, GovernorateName = "السويس",          Price = 60.00m },
                new ShippingCoasts { Id = 22, GovernorateName = "شمال سيناء",      Price = 70.00m },
                new ShippingCoasts { Id = 23, GovernorateName = "جنوب سيناء",      Price = 72.00m },
                new ShippingCoasts { Id = 24, GovernorateName = "مرسى مطروح",      Price = 75.00m },
                new ShippingCoasts { Id = 25, GovernorateName = "البحر الأحمر",     Price = 80.00m },
                new ShippingCoasts { Id = 26, GovernorateName = "كفر الشيخ",       Price = 58.00m },
                new ShippingCoasts { Id = 27, GovernorateName = "الوادي الجديد",    Price = 85.00m }
            };
        }
    }
}
