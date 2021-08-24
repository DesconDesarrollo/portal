using System;

namespace wa_SCP_IDI.Models
{
    public class ErrorViewModel
    {
        public string RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        public Exception Exception { get; set; }

        public string StatusCode { get; set; }

        public string TipoMensaje { get; set; }

        public string MensajeJson { get; set; }

        public string RutaControlador { get; set; }
    }
}