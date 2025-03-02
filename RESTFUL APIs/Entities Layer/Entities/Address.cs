namespace StoreDataAccessLayer.Entities
{
    public class Address
    {
        public int AddressId { get; set; }
        public int ClientId { get; set; }
        public string Governorate { get; set; } = null!;
        public string City { get; set; } = null!;
        public string St { get; set; } = null!;
        public Client Client { get; set; } = null!;
    }

}
