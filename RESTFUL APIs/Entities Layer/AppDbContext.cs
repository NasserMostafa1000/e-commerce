using Microsoft.EntityFrameworkCore;
using StoreDataAccessLayer.Entities;
using StoreDataAccessLayer.EntitiesConfigurations;

namespace StoreDataAccessLayer
{
    public  class AppDbcontext:DbContext
    {
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    base.OnConfiguring(optionsBuilder);
        //    var configuration = new ConfigurationBuilder().AddJsonFile("appSettings.json").Build();
        //    var ConnectionString = configuration.GetSection("ConnStr").Value;
        //    optionsBuilder.UseSqlServer(ConnectionString);
        //}
        public AppDbcontext(DbContextOptions<AppDbcontext> options) : base(options)
        {

        }
        public DbSet<Users> Users { get; set; }
        public DbSet<ShippingCoasts> ShipPrices { get; set; }
        public DbSet<PaymentsMethods> PaymentMethods { get; set; }

        public DbSet<Category> Category { get; set; }

        public DbSet<OrderStatus> OrderStatus { get; set; }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<AdminInfo> AdminInfo { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<Sizes> Sizes { get; set; }
        public DbSet<Colors> Colors { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderDetails> OrderDetails { get; set; }


        public DbSet<CartDetails> CartDetails { get; set; }
        public DbSet<ProductsDetails> ProductDetails { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(UsersConfigurations).Assembly);
        }
    }

    
    

}
