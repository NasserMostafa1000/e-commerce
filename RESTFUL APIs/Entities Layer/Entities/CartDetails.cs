namespace StoreDataAccessLayer.Entities
{
    public class  CartDetails 
    {
        public int CartDetailsId { get; set; }
        public int CartId { get; set; }
        public int ProductDetailsId { get; set; }
        public int Quantity { get; set; }
        public Cart Cart { get; set; } = null!;
        public ProductsDetails productDetails { get; set; } = null!;
    }
}
