using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using StoreBusinessLayer.Interfaces;
using StoreDataAccessLayer;
using StoreDataAccessLayer.Entities;

namespace StoreBusinessLayer.Users
{
    public class OnlineStoreLogin : ILogin
    {
        private readonly AppDbcontext _Context;
        public OnlineStoreLogin(AppDbcontext DbContext)
        {
            _Context = DbContext;
        }
       public async Task<StoreDataAccessLayer.Entities.Users> LoginWithProviderAsync(string Email,string Token, string Password)
        {
            if(string.IsNullOrEmpty(Email)||string.IsNullOrEmpty(Password))
            {
                throw new Exception("البريد الالكتروني او البسورد فارغ");
            }
            try
            {
                var user =  await _Context.Users.FirstOrDefaultAsync(user => user.EmailOrAuthId == Email);   
                if(user!=null)
                {
                    bool IsPasswordValid = PasswordHelper.VerifyPassword(Password, user.PasswordHash, user.Salt);
                    return IsPasswordValid ? user :throw new Exception("كلمه سر خاطئه");
                }
                throw new Exception("هذا الحساب لم يسجل في الموقع من قبل");
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message.ToString());
            }
            
        }
    }
}
