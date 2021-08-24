$(document).ready(function () {

    

    $(".select2_basico").select2({
    });

    $('#datatable').DataTable();

});


function BusquedaCotizacion() {
    var nombreCliente = $("#txtNomBqdCliente").val();
    var cotizacion = $("#txtNomBsqdDoc").val();
    var fechaInicio = $("#FechaInicio").val();
    var fechaFin = $("#FechaFin").val();

    toastr.clear();

    Command: toastr["info"]("Buscando...", "Información");

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
    };

    $.ajax({
        url: "/Cotizaciones/Cotizaciones/ConsultarCotizaciones",
        data: {
            nombreCliente, cotizacion, fechaInicio, fechaFin
        },
        type: 'post',
    }).done(function (data, jqXHR) {

        if (data.tipomensaje == "Error") {
            
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
            };

        } else {

            $("#ListCotizacion").html(data);

            $("#TotalListadoCount").html(data.totalregistros);

            PaginadorTipoTurno("Buscar", true, data.totalpages, cliente);

            $('#datatable').DataTable();
        }

    }).fail(function (jqXHR, errorThrown) {

        Command: toastr["error"](errorThrown, "Error");

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
        };

    }).always(function (data, textStatus, errorThrown) {

        toastr.clear();
    });
}

var subtot = 0;
var subtotal = 0;
var imp = 0;
var impuesto = 0;
var total = 0;

function AgregarRegistro() {

    var itemCode = $("#cmbArticuloCaptura option:selected").val();
    var description = $("#cmbArticuloCaptura option:selected").text();
    var price = $("#txtPrecioCaptura").val();
    var cantidad = $("#txtCantidadCaptura").val();
    var numeroFilas = $("#tdDetalleC tr").length;
    var multiplo = $("#hddMultiplo").val();

    if (cantidad != "" && itemCode != "-") {

        var item = 0;
                
        if (numeroFilas == 0) {
            item++;
        }

        else {
            item = numeroFilas + 1;
        }

        
        var fila = "<tr><td style='text-align:center'>" + item + "</td><td>" + description
            + "</td><td style='text-align:right'>" + cantidad + "</td><td style='text-align:right'>" + parseFloat(price).toFixed(2) + "</td>"
            + "</td><td style='text-align:right'>" + (parseFloat(price) * parseFloat(cantidad)).toFixed(2) + "</td>"
            + "<td style='text-align:right'>" + (parseFloat(cantidad) / parseFloat(multiplo)).toFixed(2) + "</td>"
            + "<td style='text-align:center'> " + '<input type="button" class="borrar btn btn-primary dropdown-toggle" value="Eliminar" />' + "</td> "
            + "<td hidden='hidden'>" + itemCode + "</td></tr >";

        $("#tdDetalleC").append(fila);

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
        
    }
    else {

        Command: toastr["warning"]("Debe selccionar un articulo y/o capturar una cantidad", "Validación");

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
        };

        $("#txtCantidadCaptura").focus();

    }
}

$(document).on('click', '.borrar', function (event) {
    event.preventDefault();
    $(this).closest('tr').remove();

    var numeroFilasr = $("#detallecotizacion tr").length;

    tabla = document.getElementById("detallecotizacion");
    for (var i = 1; i < numeroFilasr; i++) {
        tabla.rows[i].cells[0].innerText = i;
    }

    var SumaImporte = 0;
    var SumaImpuesto = 0;
    $("#detallecotizacion tbody tr").each(function (index) {

        $(this).children("td").each(function (index2) {
            switch (index2) {
                case 4:
                    SumaImporte = SumaImporte + parseFloat($(this).text());
                    break;
                //case 8:
                //    SumaImpuesto = SumaImpuesto + parseFloat($(this).text());
                //    break;
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
}


function GenerarCotizacion() {
    var ListaDetalle = new Array();
    var listadetalle2 = new Array();

    var cardCode = $("#cmbClienteC").val();
    var numeroFilas = $("#tdDetalleC tr").length;
    var tipodirec = $("#cmbDireccionCaptura").val();
    var oc = $("#txtOCCaptura").val();

    if (cardCode != "" || numeroFilas > 0) {

        $("#detallecotizacion tbody tr").each(function (index) {

            var itemCode, cantidad, price;

            $(this).children("td").each(function (index2) {
                switch (index2) {
                    case 2:
                        cantidad = $(this).text();
                        break;
                    case 3:
                        price = $(this).text();
                        break;
                    case 7:
                        itemCode = $(this).text();
                        break;
                }

            });
            ListaDetalle = [cantidad, itemCode, price];
            listadetalle2.push(ListaDetalle);
        });
        toastr.clear();
        //var cardCode = $("#cmbClienteC").val();
        $.ajax({
            url: "/Cotizaciones/Cotizaciones/CCotizacion",
            data: {
                cardCode, listadetalle2, tipodirec, oc
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
                };


            }
            else {

                Command: toastr["success"]("La cotización se genero correctamente", "Cotización");

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
                };

                LimpiarFormulario();

            }

        }).fail(function (jqXHR, errorThrown) {

            Command: toastr["error"]("Cliente error  al intentar generar la cotización", "Error");

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
            };

        }).always(function (data, textStatus, errorThrown) {

            
        });

        
    }
    else {

        Command: toastr["warning"]("Debe selccionar un articulo y/o capturar una cantidad", "Validación");

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
        };


    }
}

function LimpiarFormulario() {

    $("#cmbClienteC").val('');
    $("#cmbClienteC").trigger('change');
    $("#cmbDireccionCaptura").html('');
    //$("#cmbDireccionCaptura").trigger('change');
    $("#FechaEntrega").val("");
    $("#txtPrecioCaptura").val("");
    $("#txtCantidadCaptura").val("");
    $("#cmbArticuloCaptura").html('');
    //$("#cmbArticuloCaptura").trigger('change');
    $("#txtSubtotal").val("");
    $("#txtImpuesto").val("");
    $("#txtTotal").val("");
    $("#txtOCCaptura").val("");
    $("#btnMostrarFoto").prop("disabled", true);
    $("#detallecotizacion").find("tr:gt(0)").remove();
    subtot = 0;
    subtotal = 0;
    imp = 0;
    total = 0;
}

function CargaDetalle(DocEntry) {

    $.ajax({
        url: "/Cotizaciones/Cotizaciones/HacerPedido",
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

            $("#cmbClienteC").val(data.valor.cotizacion.cardCode);
            $("#cmbClienteC").trigger('change');
            $("#txtFechaCaptura").val(data.valor.cotizacion.docDate);
            $("#txtOCCaptura").val(data.valor.cotizacion.oc);
            $("#hddTipoDirec").val(data.valor.cotizacion.tipoDireccion);

            var item = 0;

            var numeroFilas = $("#tdDetalleC tr").length;

            if (numeroFilas == 0) {
                item++;
            }
            else {
                item = numeroFilas + 1;
            }

            $(data.valor.lineas).each(function (index) {
                
                var fila = "<tr><td style='text-align:center'>" + item + "</td><td style='text-align:center'>" + data.valor.lineas[index].descripcion
                    + "</td><td style='text-align:center'>" + data.valor.lineas[index].quantity + "</td><td>" + parseFloat(data.valor.lineas[index].price).toFixed(2) + "</td>"
                    + "</td><td style='text-align:right'>" + (parseFloat(data.valor.lineas[index].price) * parseFloat(data.valor.lineas[index].quantity)).toFixed(2) + "</td>"
                    + "<td style='text-align:right'>" + (parseFloat(data.valor.lineas[index].quantity) / parseFloat(data.valor.lineas[index].multiplo)).toFixed(2) + "</td>"
                    + "<td> " + '<input type="button" disabled="disabled" class="borrar btn btn-primary dropdown-toggle" value="Eliminar" />' + "</td> "
                    + "<td hidden='hidden'>" + data.valor.lineas[index].itemCode + "</td></tr >";

                $("#tdDetalleC").append(fila);

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
        }

        BloqueaControles();
    });

}

function BloqueaControles() {

    $("#cmbClienteC").prop('disabled', true);
    $("#cmbDireccionCaptura").prop('disabled', true);
    $("#FechaEntrega").prop('disabled', true);
    $("#txtPrecioCaptura").prop('disabled', true);
    $("#txtCantidadCaptura").prop('disabled', true);
    $("#cmbArticuloCaptura").prop('disabled', true);
    $("#txtSubtotal").prop('disabled', true);
    $("#txtImpuesto").prop('disabled', true);
    $("#txtTotal").prop('disabled', true);
    $("#btnAgregarRegistro").prop('disabled', true);
    $("#btnLimpiarFormulario").prop('disabled', true);
    $("#btnGenerar").prop('disabled', true);
    $("#btnMostrarFoto").prop('disabled', true);
    $("#txtOCCaptura").prop('disabled', true);

}


