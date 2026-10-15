namespace SmiApi.Models
{
    public class MaterialItem
    {
        public string Orden { get; set; } = string.Empty;
        public string Proveedor { get; set; } = string.Empty;
        public string Fecha { get; set; } = string.Empty;
        public string Moneda { get; set; } = "PEN";
        public string Codigo_sap { get; set; } = string.Empty;
        public string Nombre_material { get; set; } = string.Empty;
        public decimal Cantidad { get; set; }
        public string Unidad { get; set; } = "UN";
        public decimal Precio_unitario { get; set; }
        public decimal Cantidad_total { get; set; }
    }
}