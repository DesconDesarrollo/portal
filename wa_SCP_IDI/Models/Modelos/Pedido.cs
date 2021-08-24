using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace wa_SCP_IDI.Models.Modelos
{
    public class Pedido
    {
        //public int docDueDate { get; set; }
        public string slpCode { get; set; }
        public int docEntry { get; set; }
        public int docNum { get; set; }
        public string docDate { get; set; }
        public string cardCode { get; set; }
        public string cardName { get; set; }
        public decimal docTotal { get; set; }
        public List<PedidoDetalle> lineas { get; set; }
    }
}
