using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class ProductsDetailsConfigurations : IEntityTypeConfiguration<ProductsDetails>
    {
        public void Configure(EntityTypeBuilder<ProductsDetails> builder)
        {
            builder.HasKey(Details => Details.ProductDetailsId);
            builder.Property(Details => Details.ProductDetailsId).ValueGeneratedOnAdd();


            builder.Property(Details => Details.Quantity).HasColumnType("INT");




            builder.Property(Details => Details.ProductImage).HasColumnType("VARCHAR").HasMaxLength(255).IsRequired(false);

            builder.Property(Product => Product.ColorId).HasColumnType("TINYINT").IsRequired();
            builder.Property(Product => Product.SizeId).HasColumnType("TINYINT").IsRequired(false);


            builder.HasOne(Details => Details.Color).WithMany(Color => Color.ProductDetails).HasForeignKey(ProductDetails => ProductDetails.ColorId).IsRequired(true);

            builder.HasOne(Details => Details.Size).WithMany(size => size.ProductDetails).HasForeignKey(ProductDetails => ProductDetails.SizeId).IsRequired(false);

            builder.HasIndex(Details => new { Details.ColorId, Details.ProductId }).HasDatabaseName("IX_ProductDetails_ColorId_productId");

            builder.HasIndex(Details => new { Details.ColorId, Details.SizeId,Details.ProductDetailsId }).HasDatabaseName("IX_ProductDetails_ColorId_SizeId_ProductId");
            builder.HasIndex(Details => Details.ProductId).HasDatabaseName("IX_ProductDetails_ProductId");


            builder.ToTable("ProductsDetails");


        }
    }
}