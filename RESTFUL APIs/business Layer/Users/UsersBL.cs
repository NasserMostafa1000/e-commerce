using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StoreBusinessLayer.NotificationServices;
using StoreDataAccessLayer;
using StoreDataAccessLayer.Entities;

namespace StoreBusinessLayer.Users
{
    // business layer
    public class UsersBL
    {
        private readonly AppDbcontext _dbContext;
        private readonly TokenService _TokenServices;


        public UsersBL(AppDbcontext dbContext, TokenService TokenServices)
        {
            _dbContext = dbContext;
            _TokenServices = TokenServices;
        }        
        public async Task<string> Login(UsersDtos.LoginReq req)
        {
            try
            {
                FactoriesDP.LoginFactory Factory = new FactoriesDP.LoginFactory(_dbContext);
                //factory design pattern for Get Provider obj
                var Provider = Factory.GetLoginProvider(req.AuthProvider);

                
                //login with google need token and login with our store need email and password
                var user = await Provider.LoginWithProviderAsync(req.Email!, req.Token!, req.Password!);


                //reaching this line == correct account =>method that implement the interface will validate any error<=
                //start to create and token here
                return _TokenServices.CreateToken(user);
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<int> PostUser(UsersDtos.PostUserReq userDto,byte RoleId)
        {
            var existingUser = _dbContext.Users.FirstOrDefault(u => u.EmailOrAuthId == userDto.EmailOrAuthId);
            if (existingUser != null)
            {
                throw new InvalidOperationException("هذا الحساب موجود من قبل");
            }
            try
            {
                string salt;
                string HashedPass = PasswordHelper.HashPassword(userDto.Password, out salt);
                var User = new StoreDataAccessLayer.Entities.Users
                {
                    AuthProvider = userDto.AuthProvider,
                    EmailOrAuthId = userDto.EmailOrAuthId,
                    PasswordHash = HashedPass,
                    Salt = salt,
                    RoleId = RoleId

                };
                await _dbContext.Users.AddAsync(User);
                await _dbContext.SaveChangesAsync();

                return User.UserId;
            }
            catch (Exception ex)
            {
                throw new Exception($"{ex.Message.ToString()}");
            }
        }
        public async Task<bool> ChangeOrForgotPasswordAsync(string Email, string NewPassword, bool ForgotPassword = false, string CurrenPassword = "")
        {
            //this method used if user forgot password or want to change it 
            try
            {
                if (string.IsNullOrEmpty(Email))
                {
                    throw new Exception("البريد الالكتروني فارغ");
                }

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.EmailOrAuthId == Email);
                if (user == null)
                {
                    throw new Exception("البريد الالكتروني غير موجود");
                }
                //this check if user forgot password for create new random one
                if (ForgotPassword)
                {
                    string Salt;
                    var NewHashPassword = PasswordHelper.HashPassword(NewPassword, out Salt);
                    user.PasswordHash = NewHashPassword;
                    user.Salt = Salt;
                    _dbContext.Users.Update(user);
                    return await _dbContext.SaveChangesAsync() > 0;
                }

                //if we reach here it is mean the user change the current password with new one
                else
                {
                    if (string.IsNullOrEmpty(CurrenPassword))
                    {
                        throw new Exception("البسورد الحالي مطلوب");
                    }

                    bool IsPasswordCorrect = PasswordHelper.VerifyPassword(CurrenPassword, user.PasswordHash, user.Salt);
                    if (IsPasswordCorrect)
                    {
                        string Salt;
                        string HashedPassword = PasswordHelper.HashPassword(NewPassword, out Salt);
                        user.PasswordHash = HashedPassword;
                        user.Salt = Salt;
                        _dbContext.Users.Update(user);
                        return await _dbContext.SaveChangesAsync() > 0;
                    }
                    else
                    {
                        throw new Exception("البسورد الحالي خاطئ");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in ChangePassword: {ex.Message.ToString()}");
            }
        }
        public async Task<bool> NotificationForForgotPassword(string Email, string NotificationProviderName)
        {
            try
            {
                string randomPassword = PasswordHelper.GenerateRandomPassword(8);
                //this used for change password
                bool isPasswordChanged = await ChangeOrForgotPasswordAsync(Email, randomPassword, true);
                if (isPasswordChanged)
                {
                    await NotificationsCreator.SendNotification(
                   "لقد تم اخبارنا انك قد نسيت كلمه مرورك",
                   $"لقد انشأنا لكم كلمه سر جديدة عشوائية ولكن يجب عليك أن تغيرها في الحال من الموقع الرسمي \n كلمه السر هي {randomPassword}",
                   Email, NotificationProviderName);
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception($"{ex.Message.ToString()}");
            }
        }
        public async Task<UsersDtos.GetUserInfo> GetUserInfo(int UserId)
        {
            var UserObj = await _dbContext.Users.FirstOrDefaultAsync(U => U.UserId == UserId);
            if(UserObj!=null)
            {
               return new UsersDtos.GetUserInfo { HashedPassword = UserObj.PasswordHash, UserName = UserObj.EmailOrAuthId };
            }
            else
            {
                throw new ArgumentNullException(nameof(UserObj));
            }
        }
        public async Task<bool>SetPasswordForFirstTime(string Password,string Email)
        {
            var UserObj = await _dbContext.Users.FirstOrDefaultAsync(U => U.EmailOrAuthId == Email);
            if(UserObj==null)
            {
                throw new ArgumentNullException(nameof(UserObj));
            }
                if(!string.IsNullOrWhiteSpace(UserObj.PasswordHash))
            {
                throw new Exception("Current Password Required");
            }
                string HashedPassword;
                string Salt;
                HashedPassword = PasswordHelper.HashPassword(Password, out Salt);
                UserObj.Salt = Salt;
                UserObj.PasswordHash = HashedPassword
                    ;
                _dbContext.Users.Update(UserObj);
                await _dbContext.SaveChangesAsync();
                return true;
        }
        public async Task<List<UsersDtos.GetManagersReq>> GetManagers()
        {
            var managers = await _dbContext.Users
                .Include(user => user.Client)
                .Where(user => user.RoleId == 2 || user.RoleId == 4)
                .Select(user => new UsersDtos.GetManagersReq
                {
                    Email = user.EmailOrAuthId,
                    Password = user.PasswordHash,
                    FullName = user.Client.FirstName + " " + user.Client.SecondName,
                    RoleName = user.RoleId == 2 ? "General Manager" : "Shipping Manager"
                })
                .ToListAsync(); 
            if(managers.Count>0)
            {
            return managers; 
            }
            return new List<UsersDtos.GetManagersReq>();
        }
        public async Task<bool> RemoveManager(string email)
        {
            try
            {
                var manager = await _dbContext.Users.FirstOrDefaultAsync(user => user.EmailOrAuthId == email);
                if (manager == null)
                    return false; 
                var client = await _dbContext.Clients.FirstOrDefaultAsync(c => c.UserId == manager.UserId);
                if (client != null)
                {
                    _dbContext.Clients.Remove(client);
                }
                _dbContext.Users.Remove(manager);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
               
            }
        }


    }
}


    