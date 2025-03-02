using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreBusinessLayer.Clients
{
    public class ClientsDtos
    {
       
        public class PostClientReq
        {
            [Required]
            public string FirstName { get; set; } = null!;
            [Required]
            public string SecondName { get; set; } = null!;
            [Required]
            public string Email { get; set; } = null!;
            [Required]
            public string Password { get; set; }=null!;
            [Required]
            public string PhoneNumber { get; set; } = null!;
        }
        public class PostAddressReq
        {
            [Required]
            public string Governorate { get; set; } = null!;
            [Required]
            public string City { get; set; } = null!;
            [Required]
            public string street { get; set; } = null!;

        }
        public class GetClientReq
        {
            public string FirstName { get; set; } = null!;
            public string LastName { get; set; } = null!;
            public string? PhoneNumber { get; set; }
            public Dictionary<int, string>? ClientAddresses { get; set; }
        }
        public class GetClientsReq
        {
            public string FullName { get; set; } = null!;
            public string? PhoneNumber { get; set; }
            public string? Email { get; set; }
            public string? Password { get; set; }

            public string AuthProvider { get; set; } = null!;

        }
    }
}
