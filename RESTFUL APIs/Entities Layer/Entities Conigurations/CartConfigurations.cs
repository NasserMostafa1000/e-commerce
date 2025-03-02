using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public partial class CartConfigurations : IEntityTypeConfiguration<Cart>
    {
        public void Configure(EntityTypeBuilder<Cart> builder)
        {
            builder.HasKey(Cart => Cart.CartId);
            builder.Property(Cart => Cart.CartId).ValueGeneratedOnAdd();



            builder.HasOne(Cart => Cart.Client).WithOne(Client => Client.Cart).HasForeignKey<Cart>(cart => cart.ClientId).IsRequired();


            builder.ToTable("Carts");


        }
    }
}