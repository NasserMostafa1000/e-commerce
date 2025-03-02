using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StoreDataAccessLayer.Entities;

namespace StoreDataAccessLayer.EntitiesConfigurations
{
    public class RoleConfigurations : IEntityTypeConfiguration<Roles>
    {
        public void Configure(EntityTypeBuilder<Roles> builder)
        {
            builder.HasKey(Role => Role.RoleId);
            builder.Property(Role => Role.RoleId).ValueGeneratedOnAdd();


            builder.Property(Role => Role.RoleName).HasColumnType("VARCHAR").HasMaxLength(55).IsRequired();


            builder.Property(Product => Product.RoleId).HasColumnType("TINYINT").IsRequired();


            builder.HasMany(Role => Role.Users).WithOne(User => User.Role).HasForeignKey(user => user.RoleId).IsRequired();
            builder.ToTable("Roles");

            builder.HasData(LoadData());
        }

        private Roles[] LoadData()
        {
            return new Roles[]
             {
                new Roles { RoleId = 1, RoleName = "Admin" },
                new Roles { RoleId = 2, RoleName = "Manager" },
                new Roles { RoleId = 3, RoleName = "User" },
                new Roles { RoleId = 4, RoleName = "Shipping Manager" }
             };
        }
    }

}
