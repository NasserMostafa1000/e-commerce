using Microsoft.EntityFrameworkCore;
using StoreDataAccessLayer;

namespace StoreBusinessLayer.Products
{
    public class ColorsBL
    {

        AppDbcontext _Context;
        public ColorsBL(AppDbcontext context)
        {
            _Context = context;
        }
        public async Task<Dictionary<byte, string>> GetColorsByIdsAsync(List<byte> colorIds)
        {
            
            if(colorIds.Count>0)
            {
            return await _Context.Colors
                .Where(color => colorIds.Contains(color.ColorId))
                .ToDictionaryAsync(color => color.ColorId, color => color.ColorName);
            }
            return new Dictionary<byte, string>();
        }

        public async Task<string> GetColorNameByIdAsync(byte? ColorId)
        {
            var Color = await _Context.Colors.FirstOrDefaultAsync(Color => Color.ColorId == ColorId);

            // تحقق إذا كان الحجم غير موجود
            if (Color == null)
            {
                return "";
            }

            return Color.ColorName!;
        }
        public async Task<byte> GetColorIdByColorNameAsync(string? ColorName)
        {
            var Color = await _Context.Colors.FirstOrDefaultAsync(Color => Color.ColorName == ColorName);
            return Color!.ColorId;
        }

    }
}
