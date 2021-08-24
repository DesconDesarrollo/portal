using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace wa_SCP_IDI.Models.Utilerias
{
    public static class Utilerias
    {
        public static async Task<string> RenderViewAsync<TModel>(this Controller controller, string viewName, TModel model, bool isPartial = false)
        {
            if (string.IsNullOrEmpty(viewName))
            {
                viewName = controller.ControllerContext.ActionDescriptor.ActionName;
            }

            controller.ViewData.Model = model;

            using (var writer = new StringWriter())
            {
                IViewEngine viewEngine = controller.HttpContext.RequestServices.GetService(typeof(ICompositeViewEngine)) as ICompositeViewEngine;
                ViewEngineResult viewResult = GetViewEngineResult(controller, viewName, isPartial, viewEngine);

                if (viewResult.Success == false)
                {
                    throw new System.Exception($"La vista {viewName} no puede ser encontrada");
                }

                ViewContext viewContext = new ViewContext(
                    controller.ControllerContext,
                    viewResult.View,
                    controller.ViewData,
                    controller.TempData,
                    writer,
                    new HtmlHelperOptions()
                );

                await viewResult.View.RenderAsync(viewContext);

                return writer.GetStringBuilder().ToString();
            }
        }

        private static ViewEngineResult GetViewEngineResult(Controller controller, string viewName, bool isPartial, IViewEngine viewEngine)
        {
            if (viewName.StartsWith("~/", StringComparison.Ordinal))
            {
                var hostingEnv = controller.HttpContext.RequestServices.GetService(typeof(IHostingEnvironment)) as IHostingEnvironment;
                return viewEngine.GetView(hostingEnv.WebRootPath, viewName, !isPartial);
            }
            else
            {
                return viewEngine.FindView(controller.ControllerContext, viewName, !isPartial);

            }
        }

        public static ErrorViewModel ObtenerErrorJson(Exception ex)
        {

            ErrorViewModel ErrorViewModel = new ErrorViewModel();

            System.Text.StringBuilder SBMensaje = new System.Text.StringBuilder();

            SBMensaje.Append("Mensaje: " + ex.Message);

            if (ex.InnerException != null)
            {
                SBMensaje.Append("");

                SBMensaje.Append("Inner Exception: ");

                SBMensaje.AppendLine(ex.InnerException.Message);
            }

            ErrorViewModel.MensajeJson = SBMensaje.ToString();

            ErrorViewModel.TipoMensaje = "Error";



            return ErrorViewModel;

        }

    }
}
