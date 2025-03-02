namespace StoreDataAccessLayer.Entities
{
    public class Roles
    {
        public byte RoleId { get; set; }
        public string RoleName { get; set; } = null!;
        public ICollection<Users>? Users {get;set;}
       
    }
}
