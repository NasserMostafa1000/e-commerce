using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreBusinessLayer.Orders
{
    public class OrdersDtos
    {
        public class ClientOrders
        {

        //use for create order Req
        public class   PostOrderReq 
        {
            [Required]
            public string Address { set; get; } = null!;
            [Required]
           public  decimal TotalPrice {set;get;}
                [Required]
           public decimal ShippingCoast { get; set; }
                [Required]
           public byte PaymentMethodId { set; get; }
           public string? TransactionNumber { get; set; } 
        }
        //use for create order Details Req
        public class PostOrderDetailsReq
        {

           
            public int  OrderId { get; set; }
            [Required]
            public int ProductDetailsId { get; set; }
            [Required]
            public int Quantity { get; set; }
            [Required]
            public decimal UnitPrice { get; set; }
        }
        //Use for Get Orders Which Belongs to specific client Req
        public class GetOrdersByClientIdReq
        {
            public int OrderId { get; set; }
            public decimal TotalAmount { get; set; }
            public string OrderStatus { get; set; } = null!;
            public decimal ShippingCoast { get; set; }
            public string? RejectionReason { get; set; }
            public DateTime OrderDate { get; set; }
        }

        //Use For Get Details in Specific Order Req
        public class GetOrderDetailsInSpecificOrderReq
        {
            public int ProductId { get; set; }
            public string ProductName { get; set; } = null!;
            public string ImagePath { get; set; } = null!;
            public int Quantity { get; set; }
            public string ColorName { get; set; } = null!;
            public string? SizeName { get; set; }
            public decimal UnitPrice { get; set; }
            public decimal TotalAmount { get; set; }
        }
        }

        public class  AdminOrders
        {
           public class GetOrdersReq
        {
                public int OrderId { get; set; }
                public DateTime CreatedAt { get; set; }
                public decimal TotalAmount { get; set; }
                public string PaymentMethod { get; set; } = null!;
                public string? TransactionNumber { get; set; }
                public string Address { get; set; } = null!;
                public decimal ShippingCoast { get; set; }
                public string? RejectionReason { get; set; }
                public string OrderStatus { get; set; } = null!;
                public string FullName { get; set; } = null!;
                public string ClientPhone { get; set; } = null!;


            }
            public class GetOrdersDetailsReq
            {
                public string ProductName { get; set; } = null!;
                public int Quantity { get; set; }
                public int ProductId { get; set; }
                public string ColorName { get; set; } = null!;
                public string SizeName { get; set; } = null!;


                public decimal UnitPrice { get; set; }
                public decimal TotalPrice { get; set; }



            }

        }
    }
}
