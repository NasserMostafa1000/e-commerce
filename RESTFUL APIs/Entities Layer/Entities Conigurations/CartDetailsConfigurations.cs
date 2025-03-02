using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class CartDetailsConfigurations : IEntityTypeConfiguration<CartDetails>
    {
        public void Configure(EntityTypeBuilder<CartDetails> builder)
        {
            builder.HasKey(CartDetails => CartDetails.CartDetailsId);
            builder.Property(CartDetails => CartDetails.CartDetailsId).ValueGeneratedOnAdd();


            builder.Property(Details => Details.Quantity).HasColumnType("INT").IsRequired();



            builder.HasOne(Details => Details.Cart).WithMany(Cart => Cart.cartDetails).HasForeignKey(Details => Details.CartId).IsRequired();

            builder.HasOne(CartDetails => CartDetails.productDetails).
                WithMany(ProductDetails => ProductDetails.cartsDetails).
                HasForeignKey(ProductDetails => ProductDetails.ProductDetailsId).IsRequired();

            builder.HasIndex(CartDetails => CartDetails.CartId).HasDatabaseName("IX_CartDetails_CartId");

            builder.ToTable("CartsDetails");


        }
    }
}