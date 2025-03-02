using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreBusinessLayer.Interfaces
{
    public interface INotifications
    {
        Task SendNotification(string Subject, string Body, string UserProviderIdentifier); 
    }
}
