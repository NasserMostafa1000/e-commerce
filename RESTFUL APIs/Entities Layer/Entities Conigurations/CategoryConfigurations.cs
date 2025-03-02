using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class ProductsConfigurations
    {
        public class CategoryConfigurations : IEntityTypeConfiguration<Category>
        {
            public void Configure(EntityTypeBuilder<Category> builder)
            {
                builder.HasKey(Category => Category.CategoryId);
                builder.Property(Category => Category.CategoryId).ValueGeneratedOnAdd();

                builder.Property(Category => Category.CategoryName)
                       .HasColumnType("NVARCHAR")
                       .HasMaxLength(75)
                       .IsRequired();

                // تعريف الأصناف
                builder.HasData(
               new Category { CategoryId = 1, CategoryName = "ملابس" },
               new Category { CategoryId = 2, CategoryName = "أحذية" },
               new Category { CategoryId = 3, CategoryName = "إكسسوارات" },
               new Category { CategoryId = 4, CategoryName = "مجوهرات" },
               new Category { CategoryId = 5, CategoryName = "ساعات" },
               new Category { CategoryId = 6, CategoryName = "هواتف" },
               new Category { CategoryId = 7, CategoryName = "سيارات" },
               new Category { CategoryId = 8, CategoryName = "دراجات" },
               new Category { CategoryId = 9, CategoryName = "إلكترونيات"},
               new Category { CategoryId = 10, CategoryName = "أثاث" },
               new Category { CategoryId = 11, CategoryName = "مواد غذائية"},
               new Category { CategoryId = 12, CategoryName = "كتب" },
               new Category { CategoryId = 13, CategoryName = "ألعاب" },
               new Category { CategoryId = 14, CategoryName = "رياضة" },
               new Category { CategoryId = 15, CategoryName = "أدوات مكتبية" },
               new Category { CategoryId = 16, CategoryName = "أجهزة منزلية" },
               new Category { CategoryId = 17, CategoryName = "مستحضرات تجميل" },
               new Category { CategoryId = 18, CategoryName = "منتجات العناية الشخصية" },
               new Category { CategoryId = 19, CategoryName = "مطبخ" },
               new Category { CategoryId = 20, CategoryName = "أدوات تنظيف" },
               new Category { CategoryId = 21, CategoryName = "أدوية" },
               new Category { CategoryId = 22, CategoryName = "معدات صناعية" },
               new Category { CategoryId = 23, CategoryName = "حقائب" },
               new Category { CategoryId = 24, CategoryName = "أدوات حدائق" },
               new Category { CategoryId = 25, CategoryName = "إضاءة" },
               new Category { CategoryId = 26, CategoryName = "أخري" }

           );


                builder.ToTable("Categories");
            }
        }
    }
}
