export const formatCOP = (value: number) => {
    if (!value) return "";
    return new Intl.NumberFormat("es-CO").format(value);
};