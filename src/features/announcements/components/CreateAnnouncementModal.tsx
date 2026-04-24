import { useEffect, useRef, useState } from "react";
import { createAnnouncement } from "../services/announcementService";
import { Timestamp } from "firebase/firestore";

type Props = {
  onClose: () => void;
};

export default function CreateAnnouncementModal({ onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyPreset = (type: "7d" | "1m" | "2m") => {
    const now = new Date();
    const end = new Date();

    if (type === "7d") end.setDate(now.getDate() + 7);
    if (type === "1m") end.setMonth(now.getMonth() + 1);
    if (type === "2m") end.setMonth(now.getMonth() + 2);

    setStartDate(now.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
    setSelectedPreset(type);
  };

  const handleSave = async () => {
    if (!message || !startDate || !endDate) {
      alert("Completa todos los campos");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert("La fecha final no puede ser menor a la inicial");
      return;
    }

    await createAnnouncement({
      message,
      startDate: Timestamp.fromDate(new Date(startDate)),
      endDate: Timestamp.fromDate(new Date(endDate)),
      type: "info"
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      {/* MODAL */}
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-[fadeIn_.2s_ease]"
      >

        {/* ❌ botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-lg"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4">
          📢 Crear anuncio
        </h2>

        {/* MENSAJE */}
        <textarea
          placeholder="Ej: Hemos actualizado nuestros precios..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4 focus:ring-2 focus:ring-black outline-none"
        />

        {/* PRESETS */}
        <p className="text-sm font-semibold mb-2">Duración rápida</p>
        <div className="flex gap-2 mb-4">
          {[
            { label: "7 días", value: "7d" },
            { label: "1 mes", value: "1m" },
            { label: "2 meses", value: "2m" }
          ].map(p => (
            <button
              key={p.value}
              onClick={() => applyPreset(p.value as any)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition
                ${selectedPreset === p.value
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-100"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* DATEPICKERS */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-500">Inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSelectedPreset(null);
              }}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSelectedPreset(null);
              }}
              className="w-full border p-2 rounded-lg"
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900"
          >
            Guardar anuncio
          </button>
        </div>

      </div>
    </div>
  );
}