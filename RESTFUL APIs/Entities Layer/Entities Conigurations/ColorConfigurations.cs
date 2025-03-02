using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class ColorConfigurations : IEntityTypeConfiguration<Colors>
    {
        public void Configure(EntityTypeBuilder<Colors> builder)
        {
            builder.HasKey(Color => Color.ColorId);
            builder.Property(Color => Color.ColorId).ValueGeneratedOnAdd();

            builder.Property(Color => Color.ColorId).HasColumnType("TINYINT").IsRequired();


            builder.Property(Color => Color.ColorName)
                   .HasColumnType("NVARCHAR")
                   .HasMaxLength(20)
                   .IsRequired();
            builder.HasIndex(color => color.ColorName).IsUnique();
            builder.HasData(
                 new Colors { ColorId = 1, ColorName = "أحمر" },
                 new Colors { ColorId = 2, ColorName = "أزرق" },
                 new Colors { ColorId = 3, ColorName = "أخضر" },
                 new Colors { ColorId = 4, ColorName = "أصفر" },
                 new Colors { ColorId = 5, ColorName = "أسود" },
                 new Colors { ColorId = 6, ColorName = "أبيض" },
                 new Colors { ColorId = 7, ColorName = "رمادي" },
                 new Colors { ColorId = 8, ColorName = "برتقالي" },
                 new Colors { ColorId = 9, ColorName = "بنفسجي" },
                 new Colors { ColorId = 10, ColorName = "وردي" },
                 new Colors { ColorId = 11, ColorName = "بني" },
                 new Colors { ColorId = 12, ColorName = "ذهبي" },
                 new Colors { ColorId = 13, ColorName = "فضي" },
                 new Colors { ColorId = 14, ColorName = "تركواز" },
                 new Colors { ColorId = 15, ColorName = "نيلي" },
                 new Colors { ColorId = 16, ColorName = "كحلي" },
                 new Colors { ColorId = 17, ColorName = "عنابي" },
                 new Colors { ColorId = 18, ColorName = "بيج" },
                 new Colors { ColorId = 19, ColorName = "خردلي" },
                 new Colors { ColorId = 20, ColorName = "فيروزي" },
                 new Colors { ColorId = 21, ColorName = "زهري" },
                 new Colors { ColorId = 22, ColorName = "أرجواني" },
                 new Colors { ColorId = 23, ColorName = "لافندر" },
                 new Colors { ColorId = 24, ColorName = "موف" },
                 new Colors { ColorId = 25, ColorName = "ليموني" },
                 new Colors { ColorId = 26, ColorName = "أخضر زيتي" },
                 new Colors { ColorId = 27, ColorName = "أخضر فاتح" },
                 new Colors { ColorId = 28, ColorName = "أزرق سماوي" },
                 new Colors { ColorId = 29, ColorName = "أزرق ملكي" },
                 new Colors { ColorId = 30, ColorName = "قرمزي" }

             );

            builder.ToTable("Colors");
        }
    }
}
