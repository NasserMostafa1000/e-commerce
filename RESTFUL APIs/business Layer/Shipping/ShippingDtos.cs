using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreBusinessLayer.Shipping
{
    public class ShippingDtos
    {
        public class  GetShippingCostReq
        {
            public int Id { get; set; }
            public string Governorate { get; set; } = null!;
            public decimal Price { get; set; }


        }
       
    }
}
