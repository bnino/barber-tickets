export const handleError = (error: unknown, message = "Ocurrió un error") => {
    console.error(error);

    return {
        ok: false,
        message
    };
};