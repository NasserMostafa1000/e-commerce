using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreBusinessLayer.Clients;
using StoreBusinessLayer.Users;
using StoreDataAccessLayer;
using StoreDataAccessLayer.Entities;

namespace OnlineStoreAPIs.Controllers
{
    [Route("api/Users")]
    [ApiController]
    [AllowAnonymous]

    public class UsersController : ControllerBase
    {
        private readonly UsersBL _usersBL;
        private readonly ClientsBL _ClientsBL;

        public UsersController(UsersBL usersBL,ClientsBL clients)
        {
            _usersBL = usersBL;
            _ClientsBL = clients;
        }
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Login(UsersDtos.LoginReq req)
        {
            if (string.IsNullOrEmpty(req.Token) && string.IsNullOrEmpty(req.Email))
            {
                return BadRequest(new { Message = "معلومات هامة مفقودة" });
            }
            try
            {
                return Ok(new { Token = await _usersBL.Login(req) });
            }
            catch (Exception ex)
            {

                return BadRequest(new { Message = ex.Message.ToString() });
            }
        }


        [HttpPost("ForgotPassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> ForgotPassword(UsersDtos.ForgotPasswordReq req)
        {
            if (string.IsNullOrEmpty(req.AuthProvider) || string.IsNullOrEmpty(req.UserProviderIdentifier))
            {
                // إرجاع رسالة خطأ واضحة في حال كان أحد التفاصيل مفقودًا
                return BadRequest(new { Message = "معلومات هامه مفقوده" });
            }

            try
            {
                // استدعاء الميثود الخاصة بإعادة تعيين كلمة المرور وإرسال إشعار
                bool IsNotificationSentSuccess = await _usersBL.NotificationForForgotPassword(req.UserProviderIdentifier, req.AuthProvider);

                if (IsNotificationSentSuccess)
                {
                    return Ok(new { message = $"تم ارسال البسورد الجديد الي  {req.AuthProvider} " });
                }
                else
                {
                    return BadRequest(new { message = "فشل في ارسال البسورد الجديد" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }
        }

        [HttpGet("GetUserInfo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles="User,Admin,Manager,Shipping Manager")]
        public async Task<ActionResult> GetUserInfo()
        {
            try
            {
                int UserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                if (UserId >= 1) return Ok(await _usersBL.GetUserInfo(UserId));
                else return NotFound(nameof(UserId));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message.ToString() });
            }
        }
        [HttpPut("ChangePassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult> ChangePassword(UsersDtos.ChangePasswordReq req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "معلومات هامه مفقوده" });
            }

            try
            {
                if(string.IsNullOrWhiteSpace(req.CurrentPassword))
                {
                    var result =await _usersBL.SetPasswordForFirstTime( req.NewPassword, req.Email);
                    return result != null ? Ok() : StatusCode(500, "error occurred");
                }
                bool IsUpdated = await _usersBL.ChangeOrForgotPasswordAsync(req.Email, req.NewPassword, false, req.CurrentPassword);
                return IsUpdated ? Ok() : StatusCode(500, "error while updating Password");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message.ToString() });
            }
        }

        [HttpGet("get-managers")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize (Roles="Admin")]
        public async Task<ActionResult> GetManagers()
        {
            try
            {
                var managers = await _usersBL.GetManagers();
                return Ok(managers);
            }catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }
        }
        [HttpPost("PostManager")]
         [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> RegisterManager(UsersDtos.PostUserReq userToAdd)
        {

            try
            {
                //role id for manager =2
                int userId = await _usersBL.PostUser(userToAdd, 1);
                await _ClientsBL.AddGeneralManagerOrShippingManager("Website", "Admin", userId);
                return Ok(new { UserId = userId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("PostShippingMan")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> RegisterShippingMan(UsersDtos.PostUserReq userToAdd)
        {

            try
            {
                //role id for Ship manager =4
                int userId = await _usersBL.PostUser(userToAdd, 4);
                await _ClientsBL.AddGeneralManagerOrShippingManager("Shipping", "Manager", userId);

                //   return Ok(new { UserId = userId });
                return Ok(new { UserId = userId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("RemoveManager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles ="Admin")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> RemoveManager([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { message = "يجب إدخال البريد الإلكتروني" });
            }

            bool isDeleted = await _usersBL.RemoveManager(email);
            if (!isDeleted)
            {
                return NotFound(new { message = "لم يتم العثور على المدير" });
            }

            return Ok(new { message = "تم حذف المدير بنجاح" });
        }

    }
}
    

