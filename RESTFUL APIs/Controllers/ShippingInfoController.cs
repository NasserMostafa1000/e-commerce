using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StoreBusinessLayer.Shipping;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnlineStoreAPIs.Controllers
{
    [Route("api/ShippingInfo")]
    [ApiController]
    public class ShippingInfoController : ControllerBase
    {
        private readonly ShippingBL _shippingBL;

        public ShippingInfoController(ShippingBL shippingBL)
        {
            _shippingBL = shippingBL;
        }

        /// <summary>
        /// إرجاع قائمة بأسعار الشحن حسب المحافظة
        /// </summary>
        [HttpGet("GetShippingInfo")]
        [Authorize(Roles = "Admin,Manager,Shipping Manager")]

        public async Task<ActionResult> GetShippingInfo()
        {
            try
            {
                var shippingData = await _shippingBL.GetShippingInfo();

                if (shippingData == null || shippingData.Count == 0)
                    return NotFound("لم يتم العثور على بيانات الشحن.");

                return Ok(shippingData);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"خطأ في الخادم: {ex.Message}");
            }
        }

        /// <summary>
        /// تحديث سعر الشحن لمحافظة معينة
        /// </summary>
        /// 
        [HttpPut("UpdateShippingPrice")]
        [Authorize(Roles = "Admin,Manager,Shipping Manager")]
        public async Task<ActionResult> UpdateShippingPrice(string Governorate,decimal NewPrice)
        {
            try
            {

                var isUpdated = await _shippingBL.UpdateShippingPrice(Governorate, NewPrice);

                if (!isUpdated)
                    return NotFound($"لم يتم العثور على المحافظة: {Governorate}");

                return Ok(new { message = "تم تحديث السعر بنجاح" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"خطأ في الخادم: {ex.Message}");
            }
        }
    }
}
