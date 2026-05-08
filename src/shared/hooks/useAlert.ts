import Swal, { type SweetAlertIcon } from "sweetalert2";

type AlertOptions = {
    title?: string;
    text?: string;
    timer?: number;
};

export function useAlert() {
    const show = (icon: SweetAlertIcon, options: AlertOptions) => {
        return Swal.fire({
            icon,
            title: options.title,
            text: options.text,
            timer: options.timer,
            showConfirmButton: !options.timer,
            showClass: {
                popup: "animate__animated animate__fadeInDown animate__faster"
            },
            hideClass: {
                popup: "animate__animated animate__fadeOutUp animate__faster"
            }
        });
    };

    return {
        success: (text: string, title = "Éxito") =>
            show("success", { title, text, timer: 1500 }),

        error: (text: string, title = "Error") =>
            show("error", { title, text }),

        warning: (text: string, title = "Atención") =>
            show("warning", { title, text }),

        confirm: (text: string, title = "¿Estás seguro?") =>
            Swal.fire({
                icon: "warning",
                title,
                text,
                showCancelButton: true,
                confirmButtonText: "Sí",
                cancelButtonText: "Cancelar"
            })
    };
}