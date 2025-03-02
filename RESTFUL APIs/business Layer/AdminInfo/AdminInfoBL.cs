using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StoreDataAccessLayer;
using static StoreBusinessLayer.AdminInfo.AdminDto;

namespace StoreBusinessLayer.AdminInfo
{
    public class AdminInfoBL
    {
        private readonly AppDbcontext _dbContext;


        public AdminInfoBL(AppDbcontext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        ///uses to get the ship price and the number that the user will transfer the amount on it
        /// </summary>
        /// <param name="GovernorateName">based on GovernorateName Param , we get the shipping price</param>
        /// <returns>the number and the shipping price</returns>
        public async Task<AdminDto.GetShipPercentageAndTransActionNumberReq> GetShippingPriceAndTransactionNum(string GovernorateName)
        {
            //get transaction number
            var adminInfo = await _dbContext.AdminInfo
                .Where(Ai => Ai.Id == 1)
                .Select(Ai => new AdminDto.GetShipPercentageAndTransActionNumberReq
                {
                    TransactionNumber = Ai.TransactionNumber
                })
                .FirstOrDefaultAsync();
            if(adminInfo==null)
            {
                throw new Exception("error at Admin Info");
            }
            //get ship Price based on Governorate

            var ShipPrice =await _dbContext.ShipPrices.FirstOrDefaultAsync(Sp => Sp.GovernorateName == GovernorateName.TrimEnd().TrimStart());
            if(ShipPrice != null)
            {
                 adminInfo.ShipPrice = ShipPrice.Price;
                return adminInfo;
            }
            throw new Exception("The Governorate does not exist");
        }
        public async Task<List< AdminDto.GetAdminInfoReq>>GetAdminInfoAsync()
        {
            var adminInfo = await _dbContext.AdminInfo.Select(A => new AdminDto.GetAdminInfoReq
            {
                TransactionNumber = A.TransactionNumber,
                whatsAppNumber = A.WhatsAppNumber,
                CallNumber = A.PhoneNumber,
                Email = A.Email
            }).ToListAsync();
            return adminInfo;
        }
        public async Task<bool> UpdateAdminInfoAsync(GetAdminInfoReq updateInfo)
        {
            var adminInfo = await _dbContext.AdminInfo.FirstOrDefaultAsync();
            if (adminInfo == null)
            {
                throw new Exception("لم يتم العثور على معلومات الإدارة.");
            }
            adminInfo.TransactionNumber = updateInfo.TransactionNumber;
            adminInfo.WhatsAppNumber = updateInfo.whatsAppNumber;
            adminInfo.PhoneNumber = updateInfo.CallNumber;
            adminInfo.Email = updateInfo.Email;

            _dbContext.AdminInfo.Update(adminInfo);
            int rowsAffected = await _dbContext.SaveChangesAsync();
            return rowsAffected > 0;
        }

    }
}
