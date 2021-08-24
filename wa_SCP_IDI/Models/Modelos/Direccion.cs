using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace wa_SCP_IDI.Models.Modelos
{
    public class Direccion
    {
        public string tipoDireccion { get; set; }
        public string address { get; set; }
        public int zipCode { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string street { get; set; }
        public string AdresType { get; set; }
    }
}
