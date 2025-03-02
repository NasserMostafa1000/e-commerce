using System;
using System.Collections.Generic;
using StoreBusinessLayer.Interfaces;
using StoreBusinessLayer.NotificationServices;
using StoreBusinessLayer.Users;
using StoreDataAccessLayer;

namespace StoreBusinessLayer.FactoriesDP
{
    public class NotificationFactory
    {
        private Dictionary<string, INotifications> _logins;
        public NotificationFactory()
        {
            _logins = new Dictionary<string, INotifications>
            {
                { "gmail",  (new GmailServes()) },
       

            };
        }
        public INotifications GetNotificationProvider(string providerName)
        {
            if (_logins.ContainsKey(providerName.ToLower()))
            {
                return _logins[providerName.ToLower()];
            }

            throw new Exception($"Login provider '{providerName}' is not supported.");
        }
    }
}
