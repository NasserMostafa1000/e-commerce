namespace StoreDataAccessLayer.Entities
{
    public class ProductsDetails
    {
        public int ProductDetailsId { get; set; }
        public int ProductId { get; set; }
        public byte ColorId { get; set; }
        public byte? SizeId { get; set; }
        public int Quantity { get; set; }
        public string ProductImage { get; set; } = null!;
        public Product Product { get; set; } = null!;
        public ICollection<CartDetails>? cartsDetails { get; set; }
        public ICollection<OrderDetails>? OrdersDetails { get; set; }

        public Sizes? Size { get; set; }
        public Colors Color { get; set; } = null!;
    }
}
