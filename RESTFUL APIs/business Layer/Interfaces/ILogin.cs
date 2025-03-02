using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StoreBusinessLayer.Users;
using StoreDataAccessLayer.Entities;

namespace StoreBusinessLayer.Interfaces
{
    public  interface ILogin
    {
        Task<StoreDataAccessLayer.Entities.Users> LoginWithProviderAsync(string Email, string Token, string Password);
    }

}
