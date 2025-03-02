using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StoreBusinessLayer.Products;
using StoreDataAccessLayer;
using StoreDataAccessLayer.Entities;
using static StoreBusinessLayer.Carts.CartDtos;

namespace StoreBusinessLayer.Carts
{
    public  class CartsBL
    {
        ColorsBL _colors;
        SizesBL _Sizes;
        AppDbcontext _context;
        public CartsBL(AppDbcontext context,ColorsBL colors,SizesBL Sizes)
        {
            _context = context;
            _colors = colors;
            _Sizes = Sizes;
        }
        public async Task<int> AddCartDetailsToSpecificClient(CartDtos.AddCartDetailsReq req, int ClientId)
        {
            try
            {
                // البحث عن السلة الخاصة بالعميل
                Cart? cart = await _context.Carts.FirstOrDefaultAsync(c => c.ClientId == ClientId);

                // إذا لم يكن لديه سلة، يتم إنشاء واحدة جديدة
                if (cart == null)
                {
                    cart = new Cart { ClientId = ClientId };
                    await _context.Carts.AddAsync(cart);
                    await _context.SaveChangesAsync(); // حفظ التغييرات للحصول على `CartId`
                }

                // إنشاء تفاصيل السلة وإضافتها
                CartDetails details = new CartDetails
                {
                    CartId = cart.CartId, // ✅ استخدام `cart.CartId` بعد التأكد من عدم كونه `null`
                    ProductDetailsId = req.ProductDetailsId,
                    Quantity = req.Quantity
                };
                await _context.CartDetails.AddAsync(details);
                await _context.SaveChangesAsync();

                return details.CartId;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
       private async Task<Cart> GetClientCart(int clientId)
        {
            var Cart = await _context.Carts
                    .AsNoTracking()
                    .FirstOrDefaultAsync(cart => cart.ClientId == clientId);
            if (Cart != null) return Cart;
            else
            {
                return null;
            }
          
        }
        public async Task<List<CartDtos.GetCartReq>> GetCartDetailsByClientId(int clientId)
        {
            if (clientId <= 0)
            {
                throw new ArgumentException("Id must be greater than 0", nameof(clientId));
            }

            try
            {
                Cart clientCart =await GetClientCart(clientId);

                if (clientCart == null)
                {
                    return new List<CartDtos.GetCartReq>();
                }

                var cartDetails = await _context.CartDetails
                    .Where(cd => cd.CartId == clientCart.CartId)
                    .Include(cd => cd.productDetails)
                    .ThenInclude(pd => pd.Product)
                    .AsNoTracking()
                    .Select(cd => new
                    {
                        cd.CartId,
                        cd.CartDetailsId,
                        cd.Quantity,
                        cd.ProductDetailsId,
                        cd.productDetails.ColorId,
                        cd.productDetails.SizeId,
                        cd.productDetails.Product.ProductPrice,
                        cd.productDetails.Product.DiscountPercentage,
                        cd.productDetails.Product.ProductName,
                        cd.productDetails.ProductImage
                    })
                    .ToListAsync();

                if (!cartDetails.Any())
                {
                    return new List<CartDtos.GetCartReq>();
                }

                var colorIds = cartDetails.Select(cd => cd.ColorId).Distinct().ToList();
                var sizeIds = cartDetails
                    .Where(cd => cd.SizeId.HasValue)
                    .Select(cd => cd.SizeId!.Value)
                    .Distinct()
                    .ToList();

                var colorNames = await _colors.GetColorsByIdsAsync(colorIds);
                var sizeNames = await _Sizes.GetSizesByIdsAsync(sizeIds);

                return cartDetails.Select(cd =>
                {
                    decimal unitPriceBeforeDiscount = cd.ProductPrice;
                    decimal discountAmount = (cd.ProductPrice * cd.DiscountPercentage) / 100m;
                    decimal unitPriceAfterDiscount = unitPriceBeforeDiscount - discountAmount;
                    decimal totalAmount = cd.Quantity * unitPriceAfterDiscount;

                    return new CartDtos.GetCartReq
                    {
                        DiscountPercentage = cd.DiscountPercentage,
                        UnitPriceBeforeDiscount = unitPriceBeforeDiscount,
                        UnitPriceAfterDiscount = unitPriceAfterDiscount,
                        TotalPrice = totalAmount,
                        CartId = cd.CartId,
                        CartDetailsId = cd.CartDetailsId,
                        Color = colorNames.TryGetValue(cd.ColorId, out var colorName) ? colorName : "غير معروف",
                        Size = cd.SizeId.HasValue && sizeNames.TryGetValue(cd.SizeId.Value, out var sizeName) ? sizeName : null,
                        Quantity = cd.Quantity,
                        ProductName = cd.ProductName,
                        Image = cd.ProductImage,
                        ProductDetailsId=cd.ProductDetailsId
                    };
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<bool> RemoveItemOnCartByProductDetailsId(int CartDetailsId)
        {
            try
            {        
                    var productDetails = await _context.CartDetails
                    .FirstOrDefaultAsync(cd => cd.CartDetailsId == CartDetailsId);

                if (productDetails == null)
                {
                    return false;
                }
                
                _context.CartDetails.Remove(productDetails);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error removing product details: " + ex.Message);
            }
        }
        public async Task<bool> RemoveCartDetailsByCartId(int cartId)
        {
            try
            {
                var Cart = await _context.Carts.FirstOrDefaultAsync(c => c.CartId == cartId);
                // البحث عن تفاصيل السلة المرتبطة بـ cartId
                var cartDetails = await _context.CartDetails
                    .Where(cd => cd.CartId == cartId)
                    .ToListAsync();

                // إذا لم توجد تفاصيل السلة، نعيد false
                if (cartDetails.Count == 0)
                {
                    return false;
                }

                _context.CartDetails.RemoveRange(cartDetails);
                await _context.SaveChangesAsync();
                _context.Carts.Remove(Cart);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // في حال حدوث خطأ، يمكن إضافة معالجة للخطأ هنا
                throw new Exception("Error removing cart details: " + ex.Message);
            }
        }
        public async Task<bool>RemoveCartDetailsByClientId(int ClientId)
        {
            var ClientCart = await this.GetClientCart(ClientId);
            bool result = await RemoveCartDetailsByCartId(ClientCart.CartId);
             return result? true: false ;
        }


    }
}
