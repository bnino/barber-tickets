export type ApiResponse =
    | { ok: true }
    | { ok: false; message: string };