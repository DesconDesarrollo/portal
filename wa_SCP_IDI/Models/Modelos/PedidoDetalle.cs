using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace wa_SCP_IDI.Models.Modelos
{
    public class PedidoDetalle
    {
        public int LineNum { get; set; }
        public float quantity { get; set; }
        public string ItemCode { get; set; }
        public float price { get; set; }
        public float LineTotal { get; set; }
        public string Descripcion { get; set; }
        public Pedido Pedido { get; set; }

    }
}
