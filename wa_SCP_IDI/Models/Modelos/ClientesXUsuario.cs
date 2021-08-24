using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace wa_SCP_IDI.Models.Modelos
{
    public class ClientesXUsuario
    {
        public string usuarioWeb { get; set; }
        public string passWeb { get; set; }
        public List<Cliente> listaClientes { get; set; }
        public string slpCode { get; set; }
        public string slpName { get; set; }
    }
}
