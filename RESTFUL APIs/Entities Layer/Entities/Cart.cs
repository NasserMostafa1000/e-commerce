namespace StoreDataAccessLayer.Entities
{
    public class Cart
    {
        public int CartId { get; set; }
        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;
        public ICollection<CartDetails> cartDetails { get; set; } = null!;
    }
}
