using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreBusinessLayer.Products;

namespace OnlineStoreAPIs.Controllers
{
    [Route("api/Product")]
    [ApiController]
    [AllowAnonymous]
    public class ProductController : ControllerBase
    {
        ProductsBL _ProductsBl;
        public ProductController(ProductsBL ProductsBl)
        {
            _ProductsBl = ProductsBl;
        }
        [HttpGet("GetDiscountProducts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<ProductsDtos.GetProductsReq>>> GetTodayDiscountProducts()
        {

            try
            {
                var result = await _ProductsBl.GetDiscountsProducts();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }
        }

        [HttpGet("GetProductsWhereInClothesCategory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductsDtos.GetProductsReq>>> GetProductWhereInClothesCategory()
        {

            try
            {
                var result = await _ProductsBl.GetProductsWhereInClothesCategory();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }
        }

        [HttpGet("GetProductsByName")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductsDtos.GetProductsReq>>> GetProductsByName(string Name)
        {
            if (string.IsNullOrEmpty(Name))
                return BadRequest(new { message = "يرجى وضع اسم ما تبحث عنه قبل البحث" });

            try
            {
                return Ok(await _ProductsBl.GetListProductsWithinName(Name));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("GetProductById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductsDtos.GetProductsReq>>> GetProductsById(int ID)
        {
            if (ID<=0)
                return BadRequest(new { message = "هذا العنصر غير متوفر" });

            try
            {
                return Ok(await _ProductsBl.GetProductDetailsByProductId(ID));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetProductDetailsById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult> GetProductDetailsById(int Id)
        {
            try
            {
                return Ok(await _ProductsBl.GetDetailsByProductId(Id));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetSizesByProductId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult> GetSizesNameByProductId(int productId)
        {
            try
            {
                var sizes = await _ProductsBl.GetProductSizesByProductId(productId);

                // إذا كانت القائمة فارغة أو null، يتم إرجاع رسالة واضحة
                if (sizes == null || sizes.Count == 0)
                {
                    return Ok(new { Sizes = "No Sizes" });
                }

                return Ok(sizes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetColorsByProductId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult> GetColorsNameByProductId(int productId)
        {
            try
            {
                return Ok(await _ProductsBl.GetProductColorsByProductId(productId));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("GetDetailsBy")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult> GetSpecificDetails(int ProductId, string ColorName, string SizeName)
        {
            try
            {
                if (!string.IsNullOrEmpty(SizeName))
                {
                    var result01 = await _ProductsBl.GetDetailsBy(ProductId, ColorName, SizeName);
                    return Ok(result01);

                }
                var result02 = await _ProductsBl.GetDetailsBy(ProductId, ColorName);
                return Ok(result02);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }
        [HttpGet("GetColorsBelongsToSpecificSize")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult>GetColorsBelongsToSpecificSize(int ProductId,string SizeName)
        {
            if(string .IsNullOrEmpty(SizeName)&&ProductId<=0)
            {
                return BadRequest(new { Message = "missing important data" });
            }
            try
            {
                return  Ok(await _ProductsBl.GetAllColorsBelongsToSizeName(ProductId, SizeName));
            }catch(Exception ex)
            {
                return BadRequest(new { Message = ex.Message.ToString() });

            }
        }
        [HttpGet("GetSizesBelongsToSpecificColor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult> GetSizesBelongsToSpecificColor(int ProductId, string ColorName)
        {
            if (string.IsNullOrEmpty(ColorName) && ProductId <= 0)
            {
                return BadRequest(new { Message = "missing important data" });
            }
            try
            {
                return Ok(await _ProductsBl.GetAllSizesBelongsToColorName(ProductId, ColorName));
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message.ToString() });

            }
        }

        [HttpGet("GetProductWithName")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductsDtos.GetProductsReq>>> GetProductWithProductName(string name)
        {

            try
            {
                var result = await _ProductsBl.GetProductByName(name);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                                                 Admin section
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPost("PostProduct")]
        [Authorize(Roles = "Admin,Manager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddNewProduct(ProductsDtos.AddProductReq req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "معلومات هامه مفقوده" });
            }
            try
            {
                int id = await _ProductsBl.AddProduct(req);
                return Ok(new { Id = id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }
        }

        [HttpPost("PostProductDetails")]
          [Authorize(Roles = "Admin,Manager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddNewProductDetail(ProductsDtos.AddProductDetails req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "معلومات هامه مفقوده" });
            }
            try
            {
                int id = await _ProductsBl.AddProductDetails(req);
                return Ok(new { Id = id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }
        }
        [HttpGet("GetCategoriesNames")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
       [Authorize(Roles ="Admin,Manager")]
        public async Task<ActionResult>GetCategoriesNames()
        {
            try
            {
              
                return Ok(await _ProductsBl.GetCategoriesName());
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }

        }

        [HttpPost("UploadProductImage")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> UploadProductImage(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // تحديد مسار المجلد (سوف نستخدم مجلد ProductsImages هنا لتناسق المسارات)
            var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ProductsImages");
            if (!Directory.Exists(uploadDirectory))
            {
                Directory.CreateDirectory(uploadDirectory);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var filePath = Path.Combine(uploadDirectory, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            // استخدام نفس مسار ProductsImages لجميع الدوال
            var fileUrl = $"/ProductsImages/{fileName}";
            return Ok(new { ImageUrl = fileUrl });
        }
        [HttpPut("UpdateProductImage")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> UpdateProductImage(IFormFile imageFile, int ProductDetailsId)
        {
            try
            {
                await _ProductsBl.DeleteLastProductImageAsync(ProductDetailsId);

                if (imageFile == null || imageFile.Length == 0)
                {
                    return BadRequest("لم يتم تحميل أي ملف.");
                }

                var fileExtension = Path.GetExtension(imageFile.FileName).ToLower();
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff" };
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("نوع الملف غير مدعوم.");
                }

                var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ProductsImages");
                if (!Directory.Exists(uploadDirectory))
                {
                    Directory.CreateDirectory(uploadDirectory);
                }

                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadDirectory, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                string fileUrl = $"/ProductsImages/{fileName}";
                bool isUpdated = await _ProductsBl.UpdateProductImageAsync(ProductDetailsId, fileUrl);

                return isUpdated ? Ok(new { FileUrl = fileUrl }) : BadRequest("حدث خطأ أثناء تحديث الصورة.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"خطأ داخلي في السيرفر: {ex.Message}");
            }
        }

        [HttpPut("UpdateProduct")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> UpdateProduct(int id, [FromBody] ProductsDtos.UpdateProductDto productDto)
        {
            bool IsUpdated=   await _ProductsBl.UpdateProductAsync(productDto);

            if (IsUpdated)
                return Ok();
            else
                return BadRequest();
        }
        [HttpGet("GetFullProduct")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult>GetFullProduct(int ProductId)
        {
            try
            {

            return Ok(await _ProductsBl.GetProductWithDetailsAsync(ProductId));
            }catch(Exception ex)
            {
                return BadRequest(new { message = ex.ToString() });
            }
        }

}

}
