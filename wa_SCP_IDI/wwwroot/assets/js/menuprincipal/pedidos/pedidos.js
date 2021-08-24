$(document).ready(function () {

    $(".select2_basico").select2({
    });
});

function BusquedaPedidos() {
    var nombreCliente = $("#txtNomBqdCliente").val();
    var pedido = $("#txtNomBsqdDoc").val();
    var fechaInicio = $("#FechaIni").val();
    var fechaFin = $("#FechaFin").val();

    $.ajax({
        url: "/Pedidos/Pedidos/ConsultarPedidos",
        data: {
            nombreCliente, pedido, fechaInicio, fechaFin
        },
        type: 'post',
    }).done(function (data, jqXHR) {

        if (data.tipomensaje == "Error") {

            //$.toast({
            //    heading: 'Error',
            //    text: data.mensaje,
            //    position: 'top-right',
            //    hideAfter: 10000,
            //    icon: 'error',
            //    stack: false,
            //    loaderBg: '#f96868'
            //});

        } else {

            $("#pedidos").html(data);

            $("#TotalListadoCount").html(data.totalregistros);
        }

    }).fail(function (jqXHR, errorThrown) {

        //$.toast({
        //    heading: 'Error',
        //    text: errorThrown,
        //    position: 'top-right',
        //    hideAfter: 10000,
        //    icon: 'error',
        //    stack: false,
        //    loaderBg: '#f96868'
        //});

    }).always(function (data, textStatus, errorThrown) {

        //ToastInformacion.reset();
    });
}
function GenerarPedido() {
    var ListaDetalle = new Array();
    var listadetalle2 = new Array();

    var cardCode = $("#cmbClienteCaptura").val();
    var fechaEntrega = $("#FechaEntrega").val();
    var numeroFilas = $("#tdDetalleP tr").length;
    var tipoDireccion = $("#cmbLugarEntregaCaptura").val();
    var docEntry = $("#hddDocEntry").val();

    if (cardCode != "" && fechaEntrega != "" && numeroFilas > 0) {

        $("#detallepedido tbody tr").each(function (index) {

            var itemCode, cantidad, price;

            $(this).children("td").each(function (index2) {
                switch (index2) {
                    case 2:
                        cantidad = $(this).text();
                        break;
                    case 3:
                        price = $(this).text();
                        break;
                    case 6:
                        itemCode = $(this).text();
                        break;
                }

            });
            ListaDetalle = [itemCode, cantidad, price];
            listadetalle2.push(ListaDetalle);
        });
        toastr.clear();
        //var cardCode = $("#cmbClienteCaptura").val();
        var fentrega = $("#FechaEntrega").val();
        $.ajax({
            url: "/Pedidos/Pedidos/CPedido",
            data: {
                cardCode, listadetalle2, fentrega, tipoDireccion, docEntry
            },
            type: 'post',
        }).done(function (data, jqXHR) {

            if (data.codigo == "Error") {

                Command: toastr["error"](data.mensaje, "Error");

                toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": true,
                    "positionClass": "toast-top-right",
                    "preventDuplicates": false,
                    "onclick": null,
                    "showDuration": "3000",
                    "hideDuration": "1000",
                    "timeOut": "6000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }


            }
            else {

                Command: toastr["success"]("El pedido se genero correctamente", "Pedido")

                toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": false,
                    "positionClass": "toast-top-right",
                    "preventDuplicates": false,
                    "onclick": null,
                    "showDuration": "3000",
                    "hideDuration": "1000",
                    "timeOut": "6000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }

                LimpiarFormulario();
               
            }

        }).fail(function (jqXHR, errorThrown) {

            Command: toastr["error"]("Cliente error  al intentar generar el pedido", "Error")

            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "3000",
                "hideDuration": "1000",
                "timeOut": "6000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }

        }).always(function (data, textStatus, errorThrown) {

            
        });

        
    }
    else {

        Command: toastr["warning"]("Debe selccionar un cliente y/o seleccionar una fecha de entrega y/o capturar al menos un artículo", "Validación")

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "3000",
            "hideDuration": "1000",
            "timeOut": "6000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

    }
}

var subtot = 0;
var subtotal = 0;
var imp = 0;
var impuesto = 0;
var total = 0;

function AgregarRegistroP() {

    var itemCode = $("#cmbArticuloCaptura option:selected").val();
    var description = $("#cmbArticuloCaptura option:selected").text();
    var price = $("#txtPrecioCaptura").val();
    var cantidad = $("#txtCantidadCaptura").val();
    var numeroFilas = $("#tdDetalleP tr").length;

    if (cantidad != "" && itemCode != "-") {

        var item = 0;

        if (numeroFilas == 0) {
            item++;
        }
        else {
            item = numeroFilas + 1;
        }

        //if (ValidaRegistro() == true) {
        var fila = "<tr><td style='text-align:center'>" + item + "</td><td>" + description
            + "</td><td style='text-align:right'>" + cantidad + "</td><td style='text-align:right'>" + parseFloat(price).toFixed(2) + "</td>"
            + "</td><td style='text-align:right'>" + (parseFloat(price) * parseFloat(cantidad)).toFixed(2) + "</td>"
            + "<td  style='text-align:center'> " + '<input type="button" class="borrar btn btn-primary dropdown-toggle" value="Eliminar" />' + "</td> "
            + "<td hidden='hidden'>" + itemCode + "</td></tr >";

        $("#tdDetalleP").append(fila);

        subtot = parseFloat(price) * parseFloat(cantidad);
        subtotal = parseFloat(subtotal) + parseFloat(subtot);
        imp = parseFloat(subtot) * parseFloat(.16);
        impuesto = parseFloat(impuesto) + parseFloat(imp);
        total = parseFloat(subtotal) + parseFloat(impuesto);

        $("#txtSubtotal").val(subtotal.toFixed(2));
        $("#txtImpuesto").val(impuesto.toFixed(2));
        $("#txtTotal").val(total.toFixed(2));

        subtot = 0;
        //subtotal = 0;
        imp = 0;
        total = 0;

        LimpiarAgregarRegistro();
        //}
    }
    else {

        Command: toastr["warning"]("Debe selccionar un articulo y/o capturar una cantidad", "Validación")

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "3000",
            "hideDuration": "1000",
            "timeOut": "6000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        $("#txtCantidadCaptura").focus();
    }


}

$(document).on('click', '.borrar', function (event) {
    event.preventDefault();
    $(this).closest('tr').remove();

    var numeroFilasr = $("#detallepedido tr").length;

    tabla = document.getElementById("detallepedido");
    for (var i = 1; i <= numeroFilasr; i++) {
        tabla.rows[i].cells[0].innerText = i;
    }

    var SumaImporte = 0;
    var SumaImpuesto = 0;
    $("#detallepedido tbody tr").each(function (index) {

        $(this).children("td").each(function (index2) {
            switch (index2) {
                case 5:
                    SumaImporte = SumaImporte + parseFloat($(this).text());
                    break;
                case 8:
                    SumaImpuesto = SumaImpuesto + parseFloat($(this).text());
                    break;
            }
        });
    });

    var subtoteliminar = SumaImporte;
    var impeliminar = SumaImpuesto;
    var total = SumaImpuesto + SumaImporte;

    $("#txtSubtotal").val(subtoteliminar.toFixed(2));
    $("#txtImpuesto").val(impeliminar.toFixed(2));
    $("#txtTotal").val(total.toFixed(2));

});

function LimpiarAgregarRegistro() {

    $("#txtPrecioCaptura").val("");
    $("#txtCantidadCaptura").val("");
    $("#cmbArticuloCaptura").val('');
    $("#cmbArticuloCaptura").trigger('change');
    $("#btnMostrarFoto").prop("disabled", true);
    //$("#txtLote").val("");
    //$("#txtObservRegistro").val("");
}

function LimpiarFormulario() {

    $("#cmbClienteCaptura").val('');
    $("#cmbClienteCaptura").trigger('change');
    $("#cmbLugarEntregaCaptura").val('-');
    $("#cmbLugarEntregaCaptura").trigger('change');
    $("#FechaEntrega").val("");
    $("#txtPrecioCaptura").val("");
    $("#txtCantidadCaptura").val("");
    $("#cmbArticuloCaptura").val('');
    $("#cmbArticuloCaptura").trigger('change');
    $("#txtSubtotal").val("");
    $("#txtImpuesto").val("");
    $("#txtTotal").val("");
    $("#btnMostrarFoto").prop("disabled", true);
    $("#detallepedido").find("tr:gt(0)").remove();
    subtot = 0;
    subtotal = 0;
    imp = 0;
    total = 0;
}

function CargaDetalle(DocEntry) {

    $.ajax({
        url: "/Pedidos/Pedidos/HacerPedido",
        data: { DocEntry },
        type: 'get',
    }).done(function (data, textStatus, jqXHR) {

        if (data.codigo == "Error") {

            $.toast().reset('all');
            $("body").removeAttr('class');

            $.toast({
                heading: 'Cargar cotizacion modificar',
                text: data.mensaje,
                position: 'top-right',
                loaderBg: '#E1592F',
                icon: 'error',
                hideAfter: 5000,
                stack: 6
            });
        }
        else {

            $("#cmbClienteCaptura").val(data.valor.cotizacion.cardCode);
            $("#cmbClienteCaptura").trigger('change');
            $("#hddTipoDirec").val(data.valor.cotizacion.tipoDireccion);
            $("#hddDocEntry").val(data.valor.cotizacion.docEntry);

            var item = 0;

            var numeroFilas = $("#tdDetalleP tr").length;

            if (numeroFilas == 0) {
                item++;
            }
            else {
                item = numeroFilas + 1;
            }

            $(data.valor.lineas).each(function (index) {

                //if (ValidaRegistro() == true) {
                var fila = "<tr><td style='text-align:center'>" + item + "</td><td style='text-align:center'>" + data.valor.lineas[index].descripcion
                    + "</td><td style='text-align:center'>" + data.valor.lineas[index].quantity + "</td><td>" + parseFloat(data.valor.lineas[index].price).toFixed(2) + "</td>"
                    + "</td><td style='text-align:right'>" + (parseFloat(data.valor.lineas[index].price) * parseFloat(data.valor.lineas[index].quantity)).toFixed(2) + "</td>"
                    + "<td> " + '<input type="button" class="borrar btn btn-primary dropdown-toggle" value="Eliminar" />' + "</td> "
                    + "<td hidden='hidden'>" + data.valor.lineas[index].itemCode + "</td></tr >";

                $("#tdDetalleP").append(fila);

                subtot = parseFloat(data.valor.lineas[index].price) * parseFloat(data.valor.lineas[index].quantity);
                subtotal = parseFloat(subtotal) + parseFloat(subtot);
                imp = parseFloat(subtot) * parseFloat(.16);
                impuesto = parseFloat(impuesto) + parseFloat(imp);
                total = parseFloat(subtotal) + parseFloat(impuesto);

                $("#txtSubtotal").val(subtotal.toFixed(2));
                $("#txtImpuesto").val(impuesto.toFixed(2));
                $("#txtTotal").val(total.toFixed(2));

                subtot = 0;
                //subtotal = 0;
                imp = 0;
                total = 0;
                item++;
                
            });
            $("#cmbClienteCaptura").prop('disabled', true);
        }
    });
}


