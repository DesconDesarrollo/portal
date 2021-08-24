using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using wa_SCP_IDI.Models.Modelos;
using wa_SCP_IDI.Models.Utilerias;
using wa_SCP_IDI.Tags;

namespace wa_SCP_IDI.Areas.Cotizaciones.Controllers
{
    //[Authorize]
    [Area("Cotizaciones")]
    public class CotizacionesController : Controller
    {
        //public string slpCode;
        public Cotizacion cotizacion = new Cotizacion();
        Usuarios users = new Usuarios();
        public List<Cotizacion> ListCotizaciones;
        private readonly AppSettings _appSettings;
        private readonly IHostingEnvironment _hostingEnvironment;
        public string rspCotizacion = "";

        public CotizacionesController(IOptions<AppSettings> appsettings, IHostingEnvironment hostingEnvironment)
        {
            _appSettings = appsettings.Value;
            _hostingEnvironment = hostingEnvironment;
        }
        public IActionResult InicioC()
        {
            ContentResultObjet contentResultObjet = new ContentResultObjet();
            IActionResult IActionResult = null;
            var slpCode = AppHttpContext.Current.Session.GetInt32("_slpCode");
            var token = AppHttpContext.Current.Session.GetString("_token");
            //IQueryable<Cotizacion> IQCotizacion = null;
            //int pageSize = _appSettings.PageSize;
            //int? page = 1;
            try
            {

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("http://localhost:2727/api/cotizacion");
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var response = client.GetAsync("?SlpCode=" + slpCode.ToString()).Result;
                    string res = "";
                    if (response.IsSuccessStatusCode)
                    {
                        using (HttpContent content = response.Content)
                        {
                            Task<string> result = content.ReadAsStringAsync();
                            res = result.Result;
                            var allCotizaciones = JsonConvert.DeserializeObject<List<Cotizacion>>(res);
                            ListCotizaciones = allCotizaciones.ToList();
                        }
                    }
                }
                //HttpContext.Session.SetObject("Pedidos", IQCotizacion);

                List<Cotizacion> cotordenado = ListCotizaciones.OrderByDescending(x => x.DocNum).ToList();

                IActionResult = View(cotordenado);
            }
            catch (Exception ex)
            {
                contentResultObjet.Codigo = "Error";
                contentResultObjet.Mensaje = ex.Message;
                IActionResult = View("~/Views/Shared/ErrorLogin.cshtml", contentResultObjet);
            }
            return IActionResult;
        }

        public IActionResult CrearC(string DocEntry, string docNum)
        {
            ContentResultObjet contentResultObjet = new ContentResultObjet();
            IActionResult IActionResult = null;
            var slpCode = AppHttpContext.Current.Session.GetInt32("_slpCode");
            var token = AppHttpContext.Current.Session.GetString("_token");
            List<Cliente> lstCliente = new List<Cliente>();
            Cliente cliente = new Cliente();
            try
            {
                ViewBag.DocNum = docNum;
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("http://localhost:2727/api/cliente");
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var response = client.GetAsync("?SlpCode=" + slpCode.ToString()).Result;
                    string res = "";
                    if (response.IsSuccessStatusCode)
                    {
                        using (HttpContent content = response.Content)
                        {
                            Task<string> result = content.ReadAsStringAsync();
                            res = result.Result;
                            var allClientes = JsonConvert.DeserializeObject<List<Cliente>>(res);
                            lstCliente = allClientes.ToList();
                        }
                    }
                }

                if (DocEntry != "null")
                {
                    ViewBag.Cotizacion = DocEntry;

                }
                else
                {
                    ViewBag.Cotizacion = "null";

                }

                ViewBag.Clientes = lstCliente;
                IActionResult = View();
            }
            catch (Exception ex)
            {
                contentResultObjet.Codigo = "Error";
                contentResultObjet.Mensaje = ex.Message;
                IActionResult = View("~/Views/Shared/ErrorLogin.cshtml", contentResultObjet);
            }
            return IActionResult;
        }

        [HttpGet]
        public IActionResult Articulos(string cardCode)
        {
            ContentResultObjet contentResultObjet = new ContentResultObjet();
            IActionResult IActionResult = null;
            var slpCode = AppHttpContext.Current.Session.GetInt32("_slpCode");
            var token = AppHttpContext.Current.Session.GetString("_token");
            List<Articulo> lstarticulos = new List<Articulo>();

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("http://localhost:2727/api/articulos");
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var response = client.GetAsync("?CardCode=" + cardCode).Result; //V10000
                    string res = "";
                    if (response.IsSuccessStatusCode)
                    {
                        using (HttpContent content = response.Content)
                        {
                            Task<string> result = content.ReadAsStringAsync();
                            res = result.Result;
                            var allArticulos = JsonConvert.DeserializeObject<List<Articulo>>(res);
                            lstarticulos = allArticulos;
                        }
                    }
                }

                HttpContext.Session.SetObject("articulos", lstarticulos);

                IActionResult = Json(new
                {
                    articulos = lstarticulos
                });
            }
            catch (Exception ex)
            {
                contentResultObjet.Codigo = "Error";
                contentResultObjet.Mensaje = ex.Message;
                IActionResult = Json(new { codigo = contentResultObjet.Codigo, mensaje = contentResultObjet.Mensaje });
            }
            return IActionResult;
        }

        [HttpGet]
        public IActionResult Direcciones(string cardCode)
        {
            ContentResultObjet contentResultObjet = new ContentResultObjet();
            IActionResult IActionResult = null;
            var slpCode = AppHttpContext.Current.Session.GetInt32("_slpCode");
            var token = AppHttpContext.Current.Session.GetString("_token");
            List<Direccion> lstDirecciones = new List<Direccion>();

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("http://localhost:2727/api/direcciones");
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var response = client.GetAsync("?CardCode=" + cardCode).Result; //V10000
                    string res = "";
                    if (response.IsSuccessStatusCode)
                    {
                        using (HttpContent content = response.Content)
                        {
                            Task<string> result = content.ReadAsStringAsync();
                            res = result.Result;
                            var allDirecciones = JsonConvert.DeserializeObject<List<Direccion>>(res);
                            lstDirecciones = allDirecciones;
                        }
                    }
                }

                List<Direccion> lstdirecfil = lstDirecciones.Where(x => x.AdresType == "S").ToList();

                IActionResult = Json(new
                {
                    direcciones = lstdirecfil
                });
            }
            catch (Exception ex)
            {
                contentResultObjet.Codigo = "Error";
                contentResultObjet.Mensaje = ex.Message;
                IActionResult = Json(new { codigo = contentResultObjet.Codigo, mensaje = contentResultObjet.Mensaje });
            }
            return IActionResult;
        }

        [HttpPost]
        public IActionResult CCotizacion(string cardCode, List<string[]> listadetalle2, string tipodirec, string oc)
        {
            ContentResultObjet contentResultObjet = new ContentResultObjet();
            IActionResult IActionResult = null;
            var slpCode = AppHttpContext.Current.Session.GetInt32("_slpCode");
            var token = AppHttpContext.Current.Session.GetString("_token");
            var fecha = DateTime.Now;

            try
            {
                string cadena = "{'CardCode':'" + cardCode.ToString() + "','DocDate':'" + fecha.ToString() + "' ,'SlpCode':'"
                                + slpCode.ToString() + "' ,'OC':'" + oc + "' ,'tipoDireccion':'" + tipodirec + "', 'lineas': [";
                int k = 0;
                foreach (var item in listadetalle2)
                {
                    foreach (var item2 in item)
                    {
                        k++;
                        switch (k)
                        {
                            case 1:
                                cadena += "\n{'quantity':'" + item2.ToString() + "' ,";
                                break;
                            case 2:
                                cadena += "'ItemCode':'" + item2.ToString() + "' ,";
                                break;
                            case 3:
                                cadena += "'price':'" + item2.ToString() + "' \n},";
                                break;
                        }

                        if (k == 3)
                        {
                            k = 0;
                        }
                    }
                }

                cadena = cadena.Remove(cadena.Length - 1);
                cadena += "]}";

                JObject json = JObject.Parse(cadena);

                var httpContent = new StringContent(json.ToString(), Encoding.UTF8, "application/json");

                httpContent.Headers.ContentType.MediaType = "application/json";
                msjCotizacion respuestasrv = null;
                string res = "";
                using (var client = new HttpClient())
                {

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                    var httpResponce = client.PostAsync("http://localhost:2727/api/cotizacion", httpContent).Result;

                    var resultado = httpResponce;

                    if (resultado.IsSuccessStatusCode)
                    {
                        using (HttpContent content = resultado.Content)
                        {
                            Task<string> result = content.ReadAsStringAsync();
                            res = result.Result;

                            respuestasrv = JsonConvert.DeserializeObject<msjCotizacion>(res);

                        }
                    }
                }

                if (respuestasrv.error)
                {
                    contentResultObjet.Codigo = "Error";
                    contentResultObjet.Mensaje = respuestasrv.message;
                    IActionResult = Json(new { codigo = contentResultObjet.Codigo, mensaje = contentResultObjet.Mensaje });
                }
                else
                {
                    IActionResult = Json(new { tipomensaje = "bien" });
                }


            }
            catch (Exception ex)
            {
                contentResultObjet.Codigo = "Error";
                contentResultObjet.Mensaje = ex.Message;
                IActionResult = View("~/Views/Shared/ErrorLogin.cshtml", contentResultObjet);
            }
            return IActionResult;
        }

        public class msjCotizacion
        {
            public bool error { get; set; }
            public string message { get; set; }
        }

        public IActionResult HacerPedido(string DocEntry)
        {
            ContentResultObjet contentResultObjet = new ContentResultObjet();
            IActionResult IActionResult = null;
            cotizacion = new Cotizacion();
            var token = AppHttpContext.Current.Session.GetString("_token");

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("http://localhost:2727/Api/cotizacion");
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var response = client.GetAsync("?DocEntry=" + DocEntry).Result;
                    string res = "";
                    if (response.IsSuccessStatusCode)
                    {
                        using (HttpContent content = response.Content)
                        {
                            Task<string> result = content.ReadAsStringAsync();
                            res = result.Result;
                            var cotizadet = JsonConvert.DeserializeObject<Cotizacion>(res);
                            cotizacion = cotizadet;
                        }
                    }
                }

                IActionResult = Json(new { valor = cotizacion });
            }
            catch (Exception ex)
            {
                contentResultObjet.Codigo = "Error";
                contentResultObjet.Mensaje = ex.Message;
                IActionResult = View("~/Views/Shared/ErrorLogin.cshtml", contentResultObjet);
            }
            return IActionResult;
        }

        [HttpGet]
        public IActionResult ArticulosDatos(string selectedValue)
        {
            ContentResultObjet contentResultObjet = new ContentResultObjet();
            IActionResult IActionResult = null;
            Articulo Articulo = new Articulo();

            try
            {
                List<Articulo> lstarts = AppHttpContext.Current.Session.GetObject<List<Articulo>>("articulos");

                foreach (var item in lstarts)
                {
                    if(item.ItemCode == selectedValue)
                    {
                        Articulo.Price = item.Price;
                        Articulo.foto = item.foto;
                        Articulo.Multiplo = item.Multiplo;

                        IActionResult = Json(new { arts = Articulo });
                    }
                }

            }
            catch (Exception ex)
            {
                contentResultObjet.Codigo = "Error";
                contentResultObjet.Mensaje = ex.Message;
                IActionResult = View("~/Views/Shared/ErrorLogin.cshtml", contentResultObjet);
            }

            return IActionResult;
        }



    }
}

