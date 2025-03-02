using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StoreBusinessLayer.Carts;
using StoreBusinessLayer.Clients;
using StoreBusinessLayer.Orders;
using StoreDataAccessLayer.Entities;

namespace OnlineStoreAPIs.Controllers
{
    [Route("api/Orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        OrdersBL _OrdersBL;
        ClientsBL _Clients;
        CartsBL _CartsBl;
        //---------------------------------------------------------------------------------------------------
        //                                       Client Section
        //---------------------------------------------------------------------------------------------------
        public OrdersController(OrdersBL ordersBL, ClientsBL ClientsBL,CartsBL carts)
        {
            _OrdersBL = ordersBL;
            _Clients = ClientsBL;
            _CartsBl = carts;
        }
         [Authorize(Roles ="User")]
        [HttpPost("PostOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public async Task<ActionResult>PostOrder(OrdersDtos.ClientOrders.PostOrderReq req)
        {
            int UserId =int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            int ClientId = await _Clients.GetClientIdByUserId(UserId);
            try
            {
               int OrderId= await _OrdersBL.PostOrder(req, ClientId);
                return Ok(new { OrderId = OrderId });
            }catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }

        }


        [Authorize(Roles = "User")]
        [HttpPost("PostOrderDetails")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> PostOrderDetails(OrdersDtos.ClientOrders.PostOrderDetailsReq req)
        {
            try
            {
                int OrderDetailsId = await _OrdersBL.PostOrderDetail(req);
                return Ok(new { OrderDetailsId = OrderDetailsId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }

        }

        [HttpPost("PostListOfOrderDetails")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> PostListOrderDetails(List<OrdersDtos.ClientOrders.PostOrderDetailsReq> req,int OrderId)
        {
            int UserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            int ClientId = await _Clients.GetClientIdByUserId(UserId);
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "البيانات غير صحيحة", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }
            try
            {
                bool IsAdded = await _OrdersBL.PostListOfOrdersDetails(req, OrderId);
                if(IsAdded)
                {
                   await _CartsBl.RemoveCartDetailsByClientId(ClientId);
                return Ok();
                }
                return BadRequest( "internal server error");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.ToString() });
            }

        }
        [HttpGet("GetOrdersByClientId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult>GetOrdersByClientId()
        {
            int UserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            int ClientId = await _Clients.GetClientIdByUserId(UserId);
            try
            {
                var Orders =await _OrdersBL.GetOrdersByClientId(ClientId);
                if(Orders!=null)
                {
                    return Ok(Orders);
                }
                return NotFound("No Orders For This Client");
            }catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }
        }


        [HttpGet("GetOrderDetailsInSpecificOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> GetOrderDetailsInSpecificOrder(int OrderId)
        {
            
            try
            {
                var Details =await _OrdersBL.GetOrderDetailsInSpecificOrder(OrderId);
                if(Details!=null)
                {
                    return Ok(Details);

                }
                return NotFound("هذا الطلب لا يحتوي علي تفاصيل!");
            }catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message.ToString() });
            }
        }

        //---------------------------------------------------------------------------------------------------
        //                                       Admin Section
        //---------------------------------------------------------------------------------------------------
        [HttpGet("GetOrders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles = "Admin,Manager,Shipping Manager")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult>GetOrders(short PageNum)
        {
            try
            {

            var Orders = await _OrdersBL.GetOrders(PageNum);
            if(Orders!=null)
            {
                return Ok( Orders);
            }
            return NotFound("لا يوجد طلبات");
            }catch(Exception ex)
            {
                return Ok(new  { message = ex.Message.ToString() });
            }
        }


        [HttpGet("FindOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles = "Admin,Manager,Shipping Manager")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> FindOrders(int OrderId)
        {
            try
            {

                var Orders = await _OrdersBL.FindOrder(OrderId);
                if (Orders != null)
                {
                    return Ok(Orders);
                }
                return NotFound("لا يوجد طلبات");
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message.ToString() });
            }
        }


        [HttpPut("UpdateOrderStatues")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles = "Admin,Manager,Shipping Manager")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> UpdateOrderStatues(int OrderId,string StatusName,string RejectionReason="")
        {
            try
            {

                bool IsUpdated = await _OrdersBL.UpdateOrderStatusByName(StatusName,OrderId, RejectionReason);
                if (IsUpdated)
                {
                    return Ok();
                }
                return NotFound("خطأ في تحديث الحاله");
            }
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message.ToString() });
            }
        }
        [HttpGet("GetOrderDetails")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Admin,Manager,Shipping Manager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> OrderDetails([FromQuery] int orderId)
        {
            if (orderId <= 0)
            {
                return BadRequest("معرف الطلب غير صالح");
            }

            var orderDetails = await _OrdersBL.GetOrderDetails(orderId);

            if (orderDetails == null )
            {
                return NotFound("لم يتم العثور على تفاصيل الطلب");
            }

            return Ok(orderDetails);
        }

    }
}
