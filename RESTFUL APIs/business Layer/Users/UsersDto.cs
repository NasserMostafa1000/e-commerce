using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreBusinessLayer.Users
{
    public  class UsersDtos
    {
        public class PostUserReq
        {
            [Required]
            public string EmailOrAuthId { get; set; } = null!;
            

            public string? AuthProvider { get; set; }


            public string? Password { get; set; }


        }
        public class LoginReq
        {
            public string? Email { get; set; }
            public string? Password { get; set; }
            public string? Token { get; set; }
            public string AuthProvider { get; set; } = null!;


        }
        public class ForgotPasswordReq
        {
            public string UserProviderIdentifier { get; set; } = null!;
            public string AuthProvider { get; set; } = null!;


        }
        public class ChangePasswordReq
        {
            [Required]
            public string Email { get; set; } = null!;
            //may be user does not have one
            public string? CurrentPassword { get; set; } = "";
            [Required]
            public string NewPassword { get; set; } = null!;
        }
        public class GetUserInfo
        {
            public string? HashedPassword { get; set; }
            public string UserName { get; set; } = null!;
        }
        public class GetManagersReq
        {
            public string FullName { get; set; } = null!;
            public string RoleName { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
        }
    }
}
