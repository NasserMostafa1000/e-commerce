using StoreBusinessLayer.Interfaces;
using StoreBusinessLayer.Users;
using StoreDataAccessLayer;

namespace StoreBusinessLayer.FactoriesDP
{
    public class LoginFactory
    {
        private Dictionary<string, ILogin> _logins;
        public LoginFactory(AppDbcontext dbContext)
        {
            _logins = new Dictionary<string, ILogin>
            {
                { "google", new GoogleLogin(dbContext) },
               { "online store", new OnlineStoreLogin(dbContext) }

            };
        }
        public ILogin GetLoginProvider(string providerName)
        {
            if (_logins.ContainsKey(providerName.ToLower()))
            {
                return _logins[providerName.ToLower()];
            }

            throw new Exception($"Login provider '{providerName}' is not supported.");
        }
    }
}
