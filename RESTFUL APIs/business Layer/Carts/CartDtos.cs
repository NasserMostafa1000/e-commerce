using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreBusinessLayer.Carts
{
    public class CartDtos
    {
        public class AddCartDetailsReq { 
        public int ProductDetailsId { get; set; }
        public int Quantity { get; set; }
        }
        public class GetCartReq
        {

            public int CartDetailsId { get; set; }
            public int CartId { get; set; }
            public string? Color { get; set; }
            public string? Size { get; set; }
            public int Quantity { get; set; }
            public int ProductDetailsId { get; set; }

            public string Image { get; set; } = null!;
            public decimal TotalPrice { get; set; }
            public decimal DiscountPercentage { get; set; }
            public decimal UnitPriceBeforeDiscount { get; set; }
            public decimal UnitPriceAfterDiscount { get; set; }


            public string ProductName { get; set; } = null!;

        }
    }
}
