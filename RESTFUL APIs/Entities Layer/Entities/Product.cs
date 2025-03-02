namespace StoreDataAccessLayer.Entities
{
    public class Product
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal ProductPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
        public byte CategoryId { get; set; }
        public string MoreDetails { get; set; } = null!;
        public ICollection<ProductsDetails> ProductDetails { get; set; } = null!;

        public Category Category { get; set; } = null!;


    }
}
