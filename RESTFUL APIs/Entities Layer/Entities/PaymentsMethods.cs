namespace StoreDataAccessLayer.Entities
{
    public class PaymentsMethods
    {
        public byte MethodId { get; set; }
        public string Method { get; set; } = null!;
        public ICollection<Orders>? Orders { get; set; }
    }
}
