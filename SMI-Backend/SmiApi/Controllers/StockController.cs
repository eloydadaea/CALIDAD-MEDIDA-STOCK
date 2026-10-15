using Microsoft.AspNetCore.Mvc;
using SmiApi.Models;
using UglyToad.PdfPig; // Librería para leer PDFs
using System.Text.RegularExpressions; // Para buscar patrones en el texto

namespace SmiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private static readonly List<MaterialItem> _stockData = new()
        {
            new MaterialItem 
            { 
                Orden = "PC-BACKEND", 
                Proveedor = "C# Server", 
                Fecha = "2026-09-16", 
                Codigo_sap = "SAP-NET8", 
                Nombre_material = "Conexión Exitosa C#", 
                Cantidad = 999, 
                Precio_unitario = 10, 
                Cantidad_total = 9990 
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<MaterialItem>> GetStock()
        {
            return Ok(_stockData);
        }

        [HttpPost]
        public ActionResult<MaterialItem> PostStock([FromBody] MaterialItem nuevoItem)
        {
            if (nuevoItem == null)
            {
                return BadRequest("El registro no es válido.");
            }

            _stockData.Insert(0, nuevoItem);
            return Ok(nuevoItem);
        }

        [HttpPost("upload-pdf")]
        public IActionResult UploadPdf(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No se seleccionó ningún archivo PDF.");
            }

            try
            {
                string textoCompleto = string.Empty;

                // 1. Leer el archivo subido directamente desde la memoria
                using (var stream = file.OpenReadStream())
                using (var document = PdfDocument.Open(stream))
                {
                    // 2. Extraer el texto de todas las páginas del PDF
                    foreach (var page in document.GetPages())
                    {
                        textoCompleto += page.Text + " \n";
                    }
                }

                // 3. Buscar datos específicos usando Expresiones Regulares (Regex)
                // NOTA: Debes adaptar estos patrones (el texto dentro de las comillas "") 
                // según cómo esté escrito exactamente el texto en TUS PDFs reales.
                
                var ordenMatch = Regex.Match(textoCompleto, @"Orden[\s:]+([A-Z0-9-]+)", RegexOptions.IgnoreCase);
                var proveedorMatch = Regex.Match(textoCompleto, @"Proveedor[\s:]+([^\n\r]+)", RegexOptions.IgnoreCase);
                var fechaMatch = Regex.Match(textoCompleto, @"Fecha[\s:]+([\d]{2}/[\d]{2}/[\d]{4}|[\d]{4}-[\d]{2}-[\d]{2})", RegexOptions.IgnoreCase);
                var sapMatch = Regex.Match(textoCompleto, @"SAP[\s:]+([A-Z0-9-]+)", RegexOptions.IgnoreCase);
                var cantidadMatch = Regex.Match(textoCompleto, @"Cantidad[\s:]+([\d]+)", RegexOptions.IgnoreCase);
                var precioMatch = Regex.Match(textoCompleto, @"Precio[\s:]+([\d.,]+)", RegexOptions.IgnoreCase);

                // 4. Construir el objeto con los datos encontrados (o valores por defecto si no los encuentra)
                var datosExtraidos = new 
                {
                    orden = ordenMatch.Success ? ordenMatch.Groups[1].Value.Trim() : "No encontrada", 
                    proveedor = proveedorMatch.Success ? proveedorMatch.Groups[1].Value.Trim() : "Desconocido",
                    fecha = fechaMatch.Success ? fechaMatch.Groups[1].Value.Trim() : DateTime.Now.ToString("yyyy-MM-dd"),
                    codigo_sap = sapMatch.Success ? sapMatch.Groups[1].Value.Trim() : "SIN-SAP",
                    nombre_material = "Material extraído de " + file.FileName,
                    
                    // Convertimos los números si los encuentra, si no, ponemos 0
                    cantidad = cantidadMatch.Success && int.TryParse(cantidadMatch.Groups[1].Value, out int cant) ? cant : 0,
                    precio_unitario = precioMatch.Success && decimal.TryParse(precioMatch.Groups[1].Value.Replace(",", "."), out decimal precio) ? precio : 0m
                };

                return Ok(datosExtraidos);
            }
            catch (Exception ex)
            {
                // Si el PDF está dañado o tiene contraseña, atrapamos el error aquí
                return StatusCode(500, new { mensaje = "Error al procesar el archivo PDF", detalle = ex.Message });
            }
        }
    }
}