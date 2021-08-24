using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace wa_SCP_IDI.Models.Modelos
{
    public class Cotizacion
    {
        //public int docEntry { get; set; }
        public int? DocNum { get; set; }
        public string CardName { get; set; }
        public decimal DocTotal { get; set; }
        public string DocDate { get; set; }
        public string CardCode { get; set; }
        public string TipoDireccion { get; set; }
        public int? DocEntry { get; set; }
        public string OC { get; set; }
        public List<CotizacionDetalle> Lineas { get; set; }
        public Cotizacion cotizacion { get; set; }
    }
}