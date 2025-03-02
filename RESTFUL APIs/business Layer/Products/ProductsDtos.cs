using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StoreDataAccessLayer.Entities;

namespace StoreBusinessLayer.Products
{
    public class ProductsDtos
    {
        public class AddProductReq
        {
            public int? ProductId { get; set; }
            [Required]
            public string ProductName { get; set; } = null!;
            [Required]
            public decimal ProductPrice { get; set; }
            [Required]
            public decimal DiscountPercentage { get; set; }
            [Required]
            public string CategoryName { get; set; } = null!;
            [Required]
            public string MoreDetails { get; set; } = null!;

        }
        public class AddProductDetails
        {
            public int ProductDetailsId { get; set; }
            [Required]
            public int ProductId { get; set; }
            [Required]
            public byte ColorId { get; set; }
            public byte? SizeId { get; set; }
            [Required]
            public int Quantity { get; set; }
            [Required]
            public string ProductImage { get; set; } = null!;
        }
        public class GetProductsReq
        {
            public int? ProductId { get; set; }
            public string ProductName { get; set; } = null!;
            public decimal ProductPrice { get; set; }
            public decimal PriceAfterDiscount { get; set; }
            public decimal DiscountPercentage { get; set; }
            public string ProductImage { get; set; } = null!;
            public string MoreDetails { get; set; } = null!;

        }
        public class GetProductDetailsReq
        {
            //this uses when client try to open any product on website
            public string? Color { get; set; }
            public int ProductDetailsId { get; set; }
            public string? Size { get; set; }
            public int Quantity { get; set; }
        }
        public class GetProductDetails
        {
            //this uses when client change the color or size during buying Clothes in UI
            public int ProductDetailsId { get; set; }
            public int Quantity { get; set; }
            public string Image { get; set; } = null!;
        }

         public class UpdateProductDto
        {
            public int ProductId { get; set; }
            public string ProductName { get; set; } = null!;
            public decimal ProductPrice { get; set; }
            public string CategoryName { get; set; } = null!;
            public string MoreDetails { get; set; } = null!;
            public decimal DiscountPercentage { get; set; }
            public List<UpdateProductDetailDto> ProductDetails { get; set; }
        }

        public class UpdateProductDetailDto
        {
            public int ProductDetailId { get; set; }
            public string ColorName { get; set; }
            public string? SizeName { get; set; }
            public int Quantity { get; set; }
            public string ProductImage { get; set; }
        }

    }
}
