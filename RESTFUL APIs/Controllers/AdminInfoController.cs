using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StoreBusinessLayer.AdminInfo;
using StoreDataAccessLayer;
using StoreDataAccessLayer.Entities;

namespace OnlineStoreAPIs.Controllers
{
    [Route("api/AdminInfo")]
    [ApiController]
    public class AdminInfoController : ControllerBase
    {
        AdminInfoBL _AdminInfoBL;
        public AdminInfoController(AdminInfoBL adminInfo)
        {
            _AdminInfoBL = adminInfo;
        }
        [HttpGet("GetShipPriceAndTransactionNumber")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> ShipPriceAndTransactionNumber(string Governorate)
        {
            try
            {
               return Ok(await _AdminInfoBL.GetShippingPriceAndTransactionNum(Governorate));   

            }
            catch(Exception ex)
            {
                return StatusCode(500, "Internal Server Error  "+ ex.Message.ToString());
            }
        }
        [HttpGet("get-admin-info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [AllowAnonymous]
        public async Task<ActionResult> GetAdminInfo()
        {
            try
            {
                var data = await _AdminInfoBL.GetAdminInfoAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpPut("UpdateAdminInfo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateAdminInfo([FromBody] AdminDto.GetAdminInfoReq req)
        {
            try
            {
                bool updated = await _AdminInfoBL.UpdateAdminInfoAsync(req);
                if (updated)
                    return Ok(new { message = "تم تحديث معلومات الإدارة بنجاح." });
                return StatusCode(500, new { message = "فشل تحديث معلومات الإدارة." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message.ToString() });
            }
        }
    }
}

