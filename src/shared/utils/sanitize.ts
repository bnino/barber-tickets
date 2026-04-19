export const sanitizeText = (text: string) => {
  return text
    .trim() // quita espacios al inicio y final
    .replace(/\s+/g, " "); // evita espacios dobles
};

export const sanitizeName = (name: string) => {
  return sanitizeText(name)
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""); // solo letras
};

export const sanitizeEmail = (email: string) => {
  return sanitizeText(email).toLowerCase();
};