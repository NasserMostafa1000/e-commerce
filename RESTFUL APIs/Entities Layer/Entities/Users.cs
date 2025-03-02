using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace StoreDataAccessLayer.Entities
{
    public class Users
    {
        public int UserId { get; set; }

        public string EmailOrAuthId { get; set; } = null!;
        public string? AuthProvider { get; set; }
        public byte RoleId { get; set; }
        public string? PasswordHash { get; set; }
        public string? Salt { get; set; }
        public DateTime CreatedAt { get; set; }
        public Client? Client { get; set; }

        public Roles Role { get; set; } = null!;
    }
}
