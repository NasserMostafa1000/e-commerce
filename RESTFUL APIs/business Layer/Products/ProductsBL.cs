using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StoreDataAccessLayer;
using StoreDataAccessLayer.Entities;
using static StoreBusinessLayer.Products.ProductsDtos;

namespace StoreBusinessLayer.Products
{
    public class ProductsBL
    {
        AppDbcontext _Context;
        ColorsBL _colors;
        SizesBL _Sizes;
        CategoriesBL _CategoriesBL;

        public ProductsBL(AppDbcontext context, ColorsBL Colors,SizesBL Sizes,CategoriesBL category)
        {
            _Context = context;
            _colors = Colors;
            _Sizes = Sizes;
            _CategoriesBL = category;
        }

        public async Task<int> AddProduct(ProductsDtos.AddProductReq Req)
        {
            byte CategoryId = await _CategoriesBL.GetCategoryIdByNameAsync(Req.CategoryName);
            try
            {
                var newProduct = new Product
                {
                    CategoryId = CategoryId,
                    ProductName = Req.ProductName,
                    DiscountPercentage = Req.DiscountPercentage,
                    ProductPrice = Req.ProductPrice,
                    MoreDetails = Req.MoreDetails

                };

                await _Context.Products.AddAsync(newProduct);
                await _Context.SaveChangesAsync();
                return newProduct.ProductId;
            }
            catch
            {
                throw;
            }
        }

        public async Task<int> AddProductDetails(ProductsDtos.AddProductDetails Req)
        {
            try
            {
               var Details = new ProductsDetails
                {
                    ProductId = Req.ProductId,
                    ProductImage = Req.ProductImage,
                    Quantity = Req.Quantity,
                    ColorId =Req.ColorId,
                    SizeId =Req.SizeId == 0 ? (byte?)null : Req.SizeId,
                };

                await _Context.AddAsync(Details);
                await _Context.SaveChangesAsync();
                return Details.ProductDetailsId;
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<ProductsDtos.GetProductsReq>> GetDiscountsProducts()
        {
            try
            {
                var discountProducts = await _Context.Products
                    .Where(p => p.DiscountPercentage > 0)
                    .Include(p => p.ProductDetails)
                    .OrderBy(x => Guid.NewGuid())
                    .Take(10)
                    .ToListAsync();

                var result = discountProducts.Select(Product => new ProductsDtos.GetProductsReq
                {
                    ProductId = Product.ProductId,
                    ProductName = Product.ProductName,
                    ProductPrice = Product.ProductPrice,
                    PriceAfterDiscount = Product.ProductPrice - (Product.ProductPrice * (Product.DiscountPercentage / 100)),
                    DiscountPercentage = Product.DiscountPercentage,
                    ProductImage = Product.ProductDetails.FirstOrDefault()?.ProductImage,
                    MoreDetails=Product.MoreDetails
                   
                }).ToList();

                return result;
            }
            catch
            {
                throw;
            }
        }
        public async Task<List<ProductsDtos.GetProductsReq>> GetProductsWhereInClothesCategory()
        {
            try
            {
                var discountProducts = await _Context.Products
                    .Where(p => p.CategoryId ==1 )//1 is the id of the clothes category
                    .Include(p => p.ProductDetails)
                    .OrderBy(x => Guid.NewGuid())
                    .Take(10)
                    .ToListAsync();

                var result = discountProducts.Select(Product => new ProductsDtos.GetProductsReq
                {
                    ProductId = Product.ProductId,
                    ProductName = Product.ProductName,
                    ProductPrice = Product.ProductPrice,
                    PriceAfterDiscount = Product.ProductPrice - (Product.ProductPrice * (Product.DiscountPercentage / 100)),
                    DiscountPercentage = Product.DiscountPercentage,
                    ProductImage = Product.ProductDetails.FirstOrDefault()?.ProductImage,
                    MoreDetails = Product.MoreDetails

                }).ToList();

                return result;
            }
            catch
            {
                throw;
            }
        }

        public async Task<ProductsDtos.GetProductsReq?> GetProductByName(string name)
        {
            try
            {
                var product = await _Context.Products
                    .Include(p => p.ProductDetails)
                    .Where(p => p.ProductName == name)
                    .FirstOrDefaultAsync();

                if (product == null)
                    return null;

                return new ProductsDtos.GetProductsReq
                {
                    ProductId = product.ProductId,
                    ProductName = product.ProductName,
                    ProductPrice = product.ProductPrice,
                    PriceAfterDiscount = product.ProductPrice - (product.ProductPrice * (product.DiscountPercentage / 100)),
                    DiscountPercentage = product.DiscountPercentage,
                    ProductImage = product.ProductDetails.FirstOrDefault()?.ProductImage,
                    MoreDetails = product.MoreDetails
                };
            }
            catch (Exception ex)
            {
                // ✅ سجل الخطأ بدلاً من رميه مباشرةً
                Console.WriteLine($"خطأ أثناء جلب المنتج: {ex.Message}");
                throw;
            }
        }

        public async Task<ProductsDtos.GetProductsReq> GetProductDetailsByProductId(int ProductId)
        {
            try
            {
                var ProductInfo = await _Context.Products
                    .Include(p => p.ProductDetails) // تحميل تفاصيل المنتج المرتبطة
                    .FirstOrDefaultAsync(p => p.ProductId == ProductId); // التصفية تتم هنا وليس في Include

                if (ProductInfo != null)
                {
                    return new ProductsDtos.GetProductsReq
                    {
                        ProductId = ProductInfo.ProductId,
                        ProductName = ProductInfo.ProductName,
                        ProductPrice = ProductInfo.ProductPrice,
                        PriceAfterDiscount = ProductInfo.ProductPrice - (ProductInfo.ProductPrice * (ProductInfo.DiscountPercentage / 100)),
                        DiscountPercentage = ProductInfo.DiscountPercentage,
                        ProductImage = ProductInfo.ProductDetails.FirstOrDefault()?.ProductImage, // تجنب NullReferenceException
                        MoreDetails = ProductInfo.MoreDetails
                    };
                }

                return new ProductsDtos.GetProductsReq(); // إرجاع كائن فارغ عند عدم العثور على المنتج
            }
            catch (Exception ex)
            {
                throw new Exception("حدث خطأ أثناء جلب بيانات المنتج.", ex);
            }
        }

        public async Task<List<ProductsDtos.GetProductsReq>> GetListProductsWithinName(string productName)
        {
            if (string.IsNullOrEmpty(productName))
            {
                throw new ArgumentNullException(nameof(productName));
            }

            try
            {
                var lowerProductName = productName.ToLower();

                // جلب CategoryId في حالة كان الاسم مطابقًا لفئة معينة
                byte? categoryId = await _CategoriesBL.GetCategoryIdByNameAsync(productName);

                var products = await _Context.Products
                    .Where(p =>
                        p.ProductName.ToLower().Contains(lowerProductName) ||
                        p.ProductName.ToLower()==(lowerProductName)||
                        (categoryId.HasValue && p.CategoryId == categoryId.Value) ||
                        p.MoreDetails.ToLower().Contains(lowerProductName))
                    .Include(p => p.ProductDetails)
                    .ToListAsync();

                // إذا لم يتم العثور على منتجات، يمكن إرجاع قائمة فارغة بدلاً من `null`
                if (!products.Any())
                {
                    return new List<ProductsDtos.GetProductsReq>();
                }

                var result = products.Select(product => new ProductsDtos.GetProductsReq
                {
                    ProductId = product.ProductId,
                    ProductName = product.ProductName,
                    ProductPrice = product.ProductPrice,
                    PriceAfterDiscount = product.ProductPrice - (product.ProductPrice * (product.DiscountPercentage / 100)),
                    DiscountPercentage = product.DiscountPercentage,
                    ProductImage = product.ProductDetails.FirstOrDefault()?.ProductImage,
                    MoreDetails = product.MoreDetails
                }).ToList();

                return result;
            }
            catch 
            {
                throw;
            }
        }
        public async Task<ProductsDtos.GetProductDetailsReq> GetDetailsByProductId(int ProductId)
        {
            if (ProductId <= 0)
            {
                throw new ArgumentException("Id must be greater than 0", nameof(ProductId));
            }
            try
            {
                var productDetails = await _Context.ProductDetails
                    .FirstOrDefaultAsync(details => details.ProductId == ProductId && details.Quantity != 0);

                if (productDetails == null)
                {
                     productDetails = await _Context.ProductDetails
                                       .FirstOrDefaultAsync(details => details.ProductId == ProductId);
                }

                var result = new ProductsDtos.GetProductDetailsReq
                {
                    ProductDetailsId = productDetails!.ProductDetailsId,
                    Color = await _colors.GetColorNameByIdAsync(productDetails!.ColorId),
                    Size = productDetails.SizeId.HasValue ? await _Sizes.GetSizeNameByIdAsync(productDetails.SizeId.Value) : null,
                    Quantity = productDetails.Quantity,
                };

                return result;
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<string>> GetProductColorsByProductId(int productId)
        {
            if (productId <= 0)
            {
                throw new ArgumentException("ProductId must be greater than 0", nameof(productId));
            }

            // جلب ColorId فقط وإغلاق الاتصال بقاعدة البيانات بسرعة
            var colorIds = await _Context.ProductDetails
                .AsNoTracking()
                .Where(product => product.ProductId == productId)
                .Select(product => product.ColorId).Distinct()
                .ToListAsync();

            // تنفيذ الاستدعاءات بشكل متسلسل لتجنب مشاكل التزامن مع DbContext
            var colorNames = new List<string>();
            foreach (var id in colorIds)
            {
                colorNames.Add(await _colors.GetColorNameByIdAsync(id));
            }

            return colorNames;
        }
        public async Task<List<string>> GetProductSizesByProductId(int productId)
        {
            if (productId <= 0)
            {
                throw new ArgumentException("ProductId must be greater than 0", nameof(productId));
            }

            var sizesId = await _Context.ProductDetails
                .AsNoTracking()
                .Where(product => product.ProductId == productId)
                .Select(product => product.SizeId).Distinct()
                .ToListAsync();

            var sizesNames = new List<string>();
            foreach (var id in sizesId)
            {
                sizesNames.Add(await _Sizes.GetSizeNameByIdAsync(id));
            }

            // تحقق إذا كانت القائمة غير فارغة ثم أرجعها
            return  sizesNames.Count > 1 ? sizesNames : null!;
        }
        public async Task<ProductsDtos.GetProductDetails> GetDetailsBy(int ProductId, string ColorName, string SizeName = "")
        {
            if (ProductId <= 0 && string.IsNullOrEmpty(ColorName))
            {
                throw new Exception("missing important data");
            }
            int ColorId = await _colors.GetColorIdByColorNameAsync(ColorName);
            int? SizeId = await _Sizes.GetSizeIdByNameAsync(SizeName);
            try
            {
                //this for search by color , size ,product Id
                if (SizeId != null)
                {
                    var ProductDetails = await _Context.ProductDetails.FirstOrDefaultAsync(
                         Details => Details.ProductId == ProductId
                      && Details.SizeId == SizeId
                      && Details.ColorId == ColorId);
                    if(ProductDetails!=null)
                    {

                    var result = new ProductsDtos.GetProductDetails
                    {
                        ProductDetailsId = ProductDetails.ProductDetailsId,
                        Image = ProductDetails!.ProductImage,

                        Quantity = ProductDetails.Quantity
                    };
                       return result;
                    }
                    return null!;
                }

                //this for search by color and productid only=>that is for products that not contain  sizes
                else
                {
                    var ProductDetails = await _Context.ProductDetails.FirstOrDefaultAsync(
                    Details => Details.ProductId == ProductId
                    && Details.ColorId == ColorId);

                    var result = new ProductsDtos.GetProductDetails
                    {
                        ProductDetailsId = ProductDetails!.ProductDetailsId,
                        Image = ProductDetails!.ProductImage,
                      
                        Quantity = ProductDetails.Quantity
                    };
                    return result;
                }

            }
            catch
            {
                throw;
            }

        }
        public async Task<List<string>> GetAllColorsBelongsToSizeName(int ProductId, string SizeName)
        {
            int? SizeId = await _Sizes.GetSizeIdByNameAsync(SizeName);

            if (SizeId == null)
            {
                return new List<string>();
            }

            var productDetails = await _Context.ProductDetails
                .Where(details => details.ProductId == ProductId && details.SizeId == SizeId).Distinct()
                .ToListAsync();

            List<string> colorNames = new List<string>();

            foreach (var details in productDetails)
            {
                string colorName = await _colors.GetColorNameByIdAsync(details.ColorId);
                colorNames.Add(colorName);
            }

            return colorNames;
        }
        public async Task<List<string>> GetAllSizesBelongsToColorName(int ProductId, string ColorName)
        {
            int? ColorId = await _colors.GetColorIdByColorNameAsync(ColorName);

            if (ColorId == null)
            {
                return new List<string>();
            }

            var productDetails = await _Context.ProductDetails
                .Where(details => details.ProductId == ProductId && details.ColorId == ColorId).Distinct()
                .ToListAsync();

            List<string> colorNames = new List<string>();

            foreach (var details in productDetails)
            {
                string SizeName = await _Sizes.GetSizeNameByIdAsync(details.SizeId);
                colorNames.Add(SizeName);
            }

            return colorNames;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                           Admin section
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        public async Task<List<string>>GetCategoriesName()
        {
            return await _CategoriesBL.GetCategoriesName();
        }
        private async Task<string?> GetProductImagePathAsync(int ProductDetailsId)
        {
            var productDetails = await _Context.ProductDetails
                .FirstOrDefaultAsync(d => d.ProductDetailsId == ProductDetailsId);
            return productDetails?.ProductImage;
        }

        private static async Task<bool> DeleteImageAsync(string? imagePath)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(imagePath))
                {
                    Console.WriteLine("لا توجد صورة سابقة للحذف.");
                    return true; // لا توجد صورة، إذاً لا يوجد شيء لحذفه.
                }

                if (imagePath.StartsWith("/"))
                {
                    imagePath = imagePath.Substring(1);
                }

                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imagePath);
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    Console.WriteLine($"تم حذف الصورة: {fullPath}");
                    return true;
                }
                else
                {
                    Console.WriteLine($"⚠️ الملف غير موجود: {fullPath}");
                    return true; // الصورة غير موجودة، لا داعي للقلق.
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ خطأ أثناء حذف الصورة: {ex.Message}");
                return false;
            }
        }
        public async Task<bool> DeleteLastProductImageAsync(int ProductDetailsId)
        {
            try
            {
                string? imagePath = await GetProductImagePathAsync(ProductDetailsId);
                return await DeleteImageAsync(imagePath);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ خطأ أثناء حذف صورة المنتج: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> UpdateProductImageAsync(int ProductDetailsId, string fileUrl)
        {
            try
            {
                var productDetails = await _Context.ProductDetails
                    .FirstOrDefaultAsync(d => d.ProductDetailsId == ProductDetailsId);
                if (productDetails == null)
                {
                    return false;
                }
                productDetails.ProductImage = fileUrl;
                _Context.ProductDetails.Update(productDetails);
                return await _Context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<UpdateProductDto> GetProductWithDetailsAsync(int productId)
        {
            // محاولة جلب المنتج مع التفاصيل المرتبطة به
            var product = await _Context.Products
                       .Include(p => p.ProductDetails)
                           .ThenInclude(d => d.Color)
                       .Include(p => p.ProductDetails)
                           .ThenInclude(d => d.Size).Include(P=>P.Category)
                       .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
                throw new Exception("المنتج غير موجود");

            // التأكد من وجود التفاصيل المرتبطة بالمنتج
            if (product.ProductDetails == null || !product.ProductDetails.Any())
                throw new Exception("تفاصيل المنتج غير موجودة");

            var dto = new UpdateProductDto
            {
                ProductId = product.ProductId,
                ProductName = product.ProductName,
                ProductPrice = product.ProductPrice,
                CategoryName = product.Category.CategoryName, 
                MoreDetails = product.MoreDetails,
                DiscountPercentage = product.DiscountPercentage,
                ProductDetails = product.ProductDetails.Select(d => new UpdateProductDetailDto
                {
                    ProductDetailId = d.ProductDetailsId,
                    ColorName = d.Color?.ColorName ?? "غير محدد", 
                    SizeName = d.Size?.SizeName ?? "غير محدد",
                    Quantity = d.Quantity,
                    ProductImage = d.ProductImage
                }).ToList()
            };

            return dto;
        }
        public async Task<bool> UpdateProductAsync(UpdateProductDto updateProductDto)
        {
            // البحث عن المنتج في قاعدة البيانات مع تفاصيله
            var product = await _Context.Products
                .Include(p => p.ProductDetails)
                .FirstOrDefaultAsync(p => p.ProductId == updateProductDto.ProductId);

            if (product == null)
                throw new Exception("المنتج غير موجود");

            // تحديث بيانات المنتج الأساسية
            product.ProductName = updateProductDto.ProductName;
            product.ProductPrice = updateProductDto.ProductPrice;
            product.MoreDetails = updateProductDto.MoreDetails;
            product.DiscountPercentage = updateProductDto.DiscountPercentage;

            // تحديث التصنيف (إذا كنت تخزن التصنيف ككيان منفصل)
            var category = await _Context.Category.FirstOrDefaultAsync(c => c.CategoryName == updateProductDto.CategoryName);
            if (category == null)
                throw new Exception("التصنيف غير موجود");
            product.CategoryId =await _CategoriesBL.GetCategoryIdByNameAsync(updateProductDto.CategoryName);

            // تحديث تفاصيل المنتج
            var existingDetails = product.ProductDetails.ToList(); // قائمة بالتفاصيل الحالية في قاعدة البيانات

            foreach (var detailDto in updateProductDto.ProductDetails)
            {
                var existingDetail = existingDetails.FirstOrDefault(d => d.ProductDetailsId == detailDto.ProductDetailId);
                byte ColorId=await _colors.GetColorIdByColorNameAsync(detailDto.ColorName);
                byte? sizeId = await _Sizes.GetSizeIdByNameAsync(detailDto.SizeName);

            
                if (existingDetail != null)
                {
                    // تحديث التفاصيل الموجودة
                    existingDetail.ColorId = ColorId;
                    existingDetail.SizeId = sizeId;
                    existingDetail.Quantity = detailDto.Quantity;
                    existingDetail.ProductImage = detailDto.ProductImage;
                }
                else
                {
                    // إضافة تفاصيل جديدة
                    product.ProductDetails.Add(new ProductsDetails
                    {
                        ColorId = ColorId,
                        SizeId = sizeId,
                        Quantity = detailDto.Quantity,
                        
                        ProductImage = detailDto.ProductImage
                    });
                }
            }

            // حذف التفاصيل التي لم تعد موجودة في الطلب
            var detailIdsInRequest = updateProductDto.ProductDetails.Select(d => d.ProductDetailId).ToList();
            var detailsToRemove = existingDetails.Where(d => !detailIdsInRequest.Contains(d.ProductDetailsId)).ToList();
            _Context.ProductDetails.RemoveRange(detailsToRemove);

            // حفظ التغييرات في قاعدة البيانات
            await _Context.SaveChangesAsync();

            return true;
        }

    }
}
