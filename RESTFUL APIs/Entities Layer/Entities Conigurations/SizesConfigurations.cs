using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class SizesConfigurations : IEntityTypeConfiguration<Sizes>
    {
        public void Configure(EntityTypeBuilder<Sizes> builder)
        {
            builder.HasKey(Size => Size.SizeId);
            builder.Property(Size => Size.SizeId).ValueGeneratedOnAdd();
            builder.Property(size => size.SizeId).HasColumnType("TINYINT").IsRequired();


            builder.Property(Size => Size.SizeCategory).HasColumnType("NVARCHAR").HasMaxLength(20).IsRequired();

            builder.Property(Size => Size.SizeName).HasColumnType("NVARCHAR").HasMaxLength(20).IsRequired();

            builder.ToTable("Sizes");


            builder.HasData(LoadData());

        }

        private Sizes[] LoadData()
        {
            return new Sizes[]
            {
             new Sizes{SizeId=1, SizeName="S", SizeCategory="ملابس"},
            new Sizes{SizeId=2, SizeName="M", SizeCategory="ملابس"},
            new Sizes{SizeId=3, SizeName="L", SizeCategory="ملابس"},
            new Sizes{SizeId=4, SizeName="XL", SizeCategory="ملابس"},
            new Sizes{SizeId=5, SizeName="XXL", SizeCategory="ملابس"},
            new Sizes{SizeId=6, SizeName="XXXL", SizeCategory="ملابس"},
            new Sizes{SizeId=7, SizeName="XXXXL", SizeCategory="ملابس"},
            new Sizes{SizeId=8, SizeName="XXXXXL", SizeCategory="ملابس"},
            
            new Sizes{SizeId=9, SizeName="A", SizeCategory="حماله صدر"},
            new Sizes{SizeId=10, SizeName="B", SizeCategory="حماله صدر"},
            new Sizes{SizeId=11, SizeName="C", SizeCategory="حماله صدر"},
            new Sizes{SizeId=12, SizeName="D", SizeCategory="حماله صدر"},
            new Sizes{SizeId=13, SizeName="E", SizeCategory="حماله صدر"},
            new Sizes{SizeId=14, SizeName="F", SizeCategory="حماله صدر"}, 
            new Sizes{SizeId=15, SizeName="22", SizeCategory="بناطيل"},
            new Sizes{SizeId=16, SizeName="23", SizeCategory="بناطيل"},
            new Sizes{SizeId=17, SizeName="24", SizeCategory="بناطيل"},
            new Sizes{SizeId=18, SizeName="25", SizeCategory="بناطيل"},
            new Sizes{SizeId=19, SizeName="26", SizeCategory="بناطيل"},
            new Sizes{SizeId=20, SizeName="27", SizeCategory="بناطيل"},
            new Sizes{SizeId=21, SizeName="28", SizeCategory="بناطيل"},
            new Sizes{SizeId=22, SizeName="29", SizeCategory="بناطيل"},
            new Sizes{SizeId=23, SizeName="30", SizeCategory="بناطيل"},
            new Sizes{SizeId=24, SizeName="31", SizeCategory="بناطيل"},
            new Sizes{SizeId=25, SizeName="32", SizeCategory="بناطيل"},
            new Sizes{SizeId=26, SizeName="33", SizeCategory="بناطيل"},
            new Sizes{SizeId=27, SizeName="34", SizeCategory="بناطيل"},
            new Sizes{SizeId=28, SizeName="35", SizeCategory="بناطيل"},
            new Sizes{SizeId=29, SizeName="36", SizeCategory="بناطيل/احذيه"},
            new Sizes{SizeId=30, SizeName="37", SizeCategory="بناطيل/احذيه"},
            new Sizes{SizeId=31, SizeName="38", SizeCategory="بناطيل/احذيه"},
            new Sizes{SizeId=32, SizeName="39", SizeCategory="بناطيل/احذيه"},
            new Sizes{SizeId=33, SizeName="40", SizeCategory="بناطيل/احذيه"},
            new Sizes{SizeId=34, SizeName="41", SizeCategory="بناطيل/احذيه"},
            new Sizes{SizeId=35, SizeName="42", SizeCategory="بناطيل/احذيه"},
            new Sizes{SizeId=36, SizeName="43", SizeCategory="بناطيل/احذيه"},
            new Sizes{SizeId=37, SizeName="44", SizeCategory="بناطيل/احذيه"},
            

            };
        }
    }
}