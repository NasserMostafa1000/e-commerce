namespace StoreDataAccessLayer.Entities
{
    public class OrderStatus
    {
        public byte OrderStatusId { get; set; }
        public string StatusName { get; set; }=null!;
        public ICollection<Orders> Orders { get; set; } = null!;
    }
}
