using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StoreBusinessLayer.Users;
using StoreDataAccessLayer.Entities;
using StoreDataAccessLayer;
using Microsoft.EntityFrameworkCore;
using static StoreBusinessLayer.Clients.ClientsDtos;
using StoreBusinessLayer.Orders;

namespace StoreBusinessLayer.Clients
{
    public class ClientsBL
    {
      public  AppDbcontext _DbContext;
      public UsersBL _UsersBL;
        public ClientsBL(AppDbcontext Context,UsersBL Users)
        {
            _DbContext = Context;
            _UsersBL = Users;
        }
        public async Task<int>AddNewClient(ClientsDtos.PostClientReq Dto)
        {
            try
            {

            int UserId =await _UsersBL.PostUser(
                new UsersDtos.PostUserReq { 
                    EmailOrAuthId = Dto.Email,
                    Password = Dto.Password,
                    AuthProvider = "Online Store" },/*/ user role id => */ 3);

            Client NewClient = new Client
            {
                FirstName = Dto.FirstName,
                SecondName = Dto.SecondName,
                PhoneNumber = Dto.PhoneNumber,
                UserId = UserId

            };

                await  _DbContext.Clients.AddAsync(NewClient);
                await _DbContext.SaveChangesAsync();
                return NewClient.ClientId;
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<bool>AddGeneralManagerOrShippingManager(string FirstName,string LastName,int UserId)
        {
           await _DbContext.Clients.AddAsync(new Client { FirstName = FirstName, SecondName = LastName, UserId = UserId });
            int RowsAffected =await _DbContext.SaveChangesAsync();
            return RowsAffected > 0;
        }
        public async Task<int>GetClientIdByUserId(int UserId)
        {
            var client =await _DbContext.Clients.FirstOrDefaultAsync(Client => Client.UserId == UserId);
            return client!.ClientId;
        }
        public async Task<string?> GetClientPhoneNumberById(int ClientId)
        {
            var client = await _DbContext.Clients.FirstOrDefaultAsync(Client => Client.ClientId == ClientId);
            return client!.PhoneNumber;
        }
        public async Task<bool> AddOrUpdatePhoneToClientById(int id, string phoneNumber)
        {
            try
            {
                var targetClient = await _DbContext.Clients.FirstOrDefaultAsync(c => c.ClientId == id);
                if (targetClient == null)
                    return false;

                targetClient.PhoneNumber = phoneNumber;
                _DbContext.Update(targetClient);
                await _DbContext.SaveChangesAsync();

                return true; 
            }
            catch 
            {
                return false;
            }
        }     
        public async Task<int>AddNewAddress(ClientsDtos.PostAddressReq req,int ClientId)
        {
            var Address = new Address
            {
                Governorate = req.Governorate,
                St=req.street,
                City=req.City
               ,ClientId= ClientId,
             
            };
            await  _DbContext.Addresses.AddAsync(Address);
            await _DbContext.SaveChangesAsync();
            return Address.AddressId;
        }
        public async Task<Dictionary<int, string>> GetClientAddresses(int ClientId)
        {
            Dictionary<int, string> AddressesDic = await _DbContext.Addresses
          .Where(ad => ad.ClientId == ClientId)
          .ToDictionaryAsync(ad => ad.AddressId,
              ad => ad.Governorate + "-" + " مدينه " + ad.City + "  شارع " + ad.St);

            if (AddressesDic != null)
            {
                return AddressesDic;
            }
            return new Dictionary<int, string>();
        }
        public async Task<ClientsDtos.GetClientReq>GetClientById(int ClientId )
        {
            var Client = await _DbContext.Clients.Where(c => c.ClientId == ClientId).Include(c => c.Addresses).FirstOrDefaultAsync();
            if (Client!=null)
            {
                return new ClientsDtos.GetClientReq { FirstName = Client.FirstName,
                    LastName = Client.SecondName,
                    ClientAddresses=await GetClientAddresses(ClientId),
                    PhoneNumber = Client.PhoneNumber };

            }
            else
            {
                return null!;
            }
        }
        public async Task<bool>GetClientName(string FirstName, string LastName,int ClientId)
        {
            var Client =await _DbContext.Clients.FirstOrDefaultAsync(c => c.ClientId == ClientId);
            if(Client!=null)
            {
                Client.FirstName = FirstName;
                Client.SecondName = LastName;
                _DbContext.Clients.Update(Client);
              await  _DbContext.SaveChangesAsync();
                return true;
            }
            return false;
            throw new ArgumentNullException(nameof(Client));
        }
        public async Task<List<GetClientsReq>> GetClientsAsync(int PageNum)
        {
            // نفترض أن _dbContext هو الـ DbContext المُستخدم في مشروعك
            var clients = await _DbContext.Clients.Include(C=>C.User).Where(C=>C.User.RoleId==3)
                .Select(c => new GetClientsReq
                {
                    FullName = c.FirstName+" "+c.SecondName,
                    PhoneNumber = c.PhoneNumber,
                    Email = c.User.EmailOrAuthId,
                    Password = c.User.PasswordHash, // تأكد من ضرورة إرجاع كلمة المرور وفقًا لمتطلبات الأمان
                    AuthProvider = c.User.AuthProvider
                })
                .Paginate(PageNum).ToListAsync();
            if (clients != null)
            {
            return clients ;
            }
            return new List<GetClientsReq>();
        }

    }
}
