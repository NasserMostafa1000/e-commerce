namespace StoreDataAccessLayer.Entities
{
    public class Category
    {
        public byte CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public ICollection<Product>? Products { get; set; }
    }
}
