export const formatCOP = (value: number) => {
    if (value == null || isNaN(value)) return "";
    return new Intl.NumberFormat("es-CO").format(value);
};