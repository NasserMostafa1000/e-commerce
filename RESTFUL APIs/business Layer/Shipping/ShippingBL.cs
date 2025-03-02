using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StoreDataAccessLayer;

namespace StoreBusinessLayer.Shipping
{
    public class ShippingBL
    {
      private readonly   AppDbcontext _Context;
        public  ShippingBL(AppDbcontext context)
        {
            _Context=context;
        }
        public async Task<List<ShippingDtos.GetShippingCostReq>> GetShippingInfo()
        {
            try
            {
                var prices = await _Context.ShipPrices
                    .Select(ShipPrice => new ShippingDtos.GetShippingCostReq
                    {
                        Governorate = ShipPrice.GovernorateName,
                        Price = ShipPrice.Price,
                        Id = ShipPrice.Id,
                    })
                    .ToListAsync(); // تحويل الاستعلام إلى قائمة

                return prices; // إرجاع البيانات
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching shipping info: {ex.Message}");
            }
        }
        public async Task<bool> UpdateShippingPrice(string governorate, decimal newPrice)
        {
            var shippingRecord = await _Context.ShipPrices
                .FirstOrDefaultAsync(s => s.GovernorateName == governorate);

            if (shippingRecord == null)
                return false;


            shippingRecord.Price = newPrice;


            await _Context.SaveChangesAsync();
            return true;
        }


    }
}
