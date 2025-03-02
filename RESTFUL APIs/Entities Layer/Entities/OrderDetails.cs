namespace StoreDataAccessLayer.Entities
{
    public class OrderDetails
    {
        public int OrderDetailsId { get; set; }
        public int OrderId { get; set; }
        public int ProductDetailsId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public ProductsDetails ProductDetails { get; set; } = null!;
        public Orders Order { get; set; } = null!;

    }
}
