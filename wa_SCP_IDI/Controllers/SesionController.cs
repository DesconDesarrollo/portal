using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using wa_SCP_IDI.Models.Modelos;
using wa_SCP_IDI.Models.Utilerias;
using wa_SCP_IDI.Tags;

namespace wa_SCP_IDI.Controllers
{
    public class SesionController : Controller
    {
        public string token = string.Empty;
        public List<allUsuarios> LstAllUsuarios;
        public int slpCode;
        public string contrasena;
        public string result;
        public string nomuser;
        public bool crearpedido;
        const string SessionToken = "_token";
        const string SessionSlpCode = "_slpCode";
        const string SessionSlpName = "_slpName";
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult InicioSesion(string usuario, string password)
        {
            ContentResultObjet contentResultObjet = new ContentResultObjet();
            IActionResult IActionResult = null;
            bool acceso = false;
            Usuarios users = new Usuarios();
            try
            {
                if (token == string.Empty)
                {
                    users.Username = "Javier";
                    users.Password = "jav3097.";

                    string cadena = "{'Username':'Javier','Password':'jav3097.'}";
                    var httpContent = new StringContent(cadena);
                    httpContent.Headers.ContentType.MediaType = "application/json";


                    using (var client = new HttpClient())
                    {
                        HttpResponseMessage response = client.PostAsync("http://51.79.33.57:44312/api/login", httpContent).Result;

                        var resultado = response;

                        string res = "";
                        if (resultado.IsSuccessStatusCode)
                        {
                            using (HttpContent content = resultado.Content)
                            {
                                Task<string> result = content.ReadAsStringAsync();
                                res = result.Result;
                                var token1 = JsonConvert.DeserializeObject<Usuarios>(res);
                                token = token1.message;
                            }
                        }
                    }
                }

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("http://51.79.33.57:44312/api/");
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var response = client.GetAsync("usuario").Result;
                    string res = "";
                    if (response.IsSuccessStatusCode)
                    {
                        using (HttpContent content = response.Content)
                        {
                            Task<string> result = content.ReadAsStringAsync();
                            res = result.Result;
                            var allUsuario = JsonConvert.DeserializeObject<List<allUsuarios>>(res);
                            LstAllUsuarios = allUsuario.ToList();
                        }

                    }
                }

                byte[] encryted = System.Text.Encoding.UTF8.GetBytes(password);
                result = Convert.ToBase64String(encryted);

                foreach (var item in LstAllUsuarios)
                {
                    if (item.UsuarioWeb == usuario)
                    {
                        slpCode = item.SlpCode;
                        contrasena = item.PassWeb;
                        nomuser = item.SLPName;
                        crearpedido = item.CrearPedido;

                        if (contrasena == result)
                        {
                            acceso = true;
                        }
                    }
                }

                if (acceso)
                {
                    var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.NameIdentifier, usuario),
                            new Claim(ClaimTypes.Name, password)
                        };
                    var userIdentity = new ClaimsIdentity(claims, "SecureLogin");
                    var userPrincipal = new ClaimsPrincipal(userIdentity);

                    HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, userPrincipal,
                        new AuthenticationProperties
                        {
                            ExpiresUtc = DateTime.Now.AddHours(10),
                            IsPersistent = false,
                            AllowRefresh = false
                        });

                    HttpContext.Session.SetString(SessionToken, token);
                    HttpContext.Session.SetInt32(SessionSlpCode, slpCode);
                    HttpContext.Session.SetString(SessionSlpName, nomuser);
                    HttpContext.Session.SetBoolean("CraerPedido", crearpedido);

                    return RedirectToAction("InicioC", "Cotizaciones", new { area = "Cotizaciones" });
                }
                else
                {
                    contentResultObjet.Codigo = "Error";
                    contentResultObjet.Mensaje = "El usuario o la contraseña son incorrectas";
                    IActionResult = View("~/Views/Shared/ErrorLogin.cshtml", contentResultObjet);
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

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();

            return RedirectToAction("Login", "Sesion", new { Area = "" });
        }
    }


    public class allUsuarios
    {
        public string UsuarioWeb { get; set; }
        public string PassWeb { get; set; }
        public int SlpCode { get; set; }
        public string SLPName { get; set; }
        public bool CrearPedido { get; set; }
    }

    public class lstAllUsers
    {
        public List<allUsuarios> listaUsers { get; set; }
    }
}