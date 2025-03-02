using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace StoreBusinessLayer.AdminInfo
{
    public class AdminDto
    {
        public class GetShipPercentageAndTransActionNumberReq
        {
        
            public string TransactionNumber { get; set; } = null!;
            
            public decimal ShipPrice { get; set; }
        }
        public class GetAdminInfoReq
        {
            public string TransactionNumber { get; set; } = null!;
            public string whatsAppNumber { get; set; } = null!;
            public string CallNumber { get; set; } = null!;
            public string Email { get; set; }=null!;
        }

    }
}
