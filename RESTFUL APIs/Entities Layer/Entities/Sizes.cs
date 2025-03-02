using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreDataAccessLayer.Entities
{
    public  class Sizes
    {
        public byte SizeId { get; set; }
        public string SizeName { get; set; } = null!;
        public string SizeCategory { get; set; } = null!;
        public ICollection<ProductsDetails>? ProductDetails { get; set; } 


    }
}
