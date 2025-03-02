using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreDataAccessLayer.Entities
{
    public class ShippingCoasts
    {
         public  byte Id { get; set; }
        public string GovernorateName { get; set; } = null!;
         public decimal Price { get; set; }
    }
}
