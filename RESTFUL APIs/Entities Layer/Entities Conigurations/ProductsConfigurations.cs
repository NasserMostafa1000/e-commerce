using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class ProductsConfigurations : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(Product => Product.ProductId);
            builder.Property(Product => Product.ProductId).ValueGeneratedOnAdd();


            builder.Property(Product => Product.ProductPrice).HasColumnType("DECIMAL").HasPrecision(10, 2).IsRequired();

            builder.Property(Product => Product.DiscountPercentage).HasColumnType("DECIMAL").HasPrecision(5, 2).HasDefaultValue(0.0);
            builder.Property(Details => Details.MoreDetails).HasColumnType("NVARCHAR").HasMaxLength(1000);

            builder.Property(Product => Product.CategoryId).HasColumnType("TINYINT").IsRequired();


            builder.Property(Product => Product.ProductName).HasColumnType("NVARCHAR").HasMaxLength(250).IsRequired();


            builder.HasMany(Product => Product.ProductDetails)
                .WithOne(productDetails => productDetails.Product)
                .HasForeignKey(ProductDetails => ProductDetails.ProductId).IsRequired();

            builder.HasOne(product => product.Category).WithMany(category => category.Products).HasForeignKey(product => product.CategoryId).IsRequired();

            builder.ToTable("Products");
        }
        }

} 