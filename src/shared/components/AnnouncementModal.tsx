import { useState } from "react";

export default function AnnouncementModal({ announcement }: any) {

  const [open, setOpen] = useState(true);

  const today = new Date().toDateString();

  const lastSeen = localStorage.getItem(
    "seen_announcement_" + announcement.id
  );

  const handleClose = () => {
    localStorage.setItem(
      "seen_announcement_" + announcement.id,
      new Date().toDateString()
    );
    setOpen(false);
  };

  if (lastSeen === today) return null;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => {
        handleClose();
      }}
    >
      <div
        className="bg-white rounded-xl p-6 w-96 shadow-lg text-center"
        onClick={(e) => e.stopPropagation()} // 👈 CLAVE
      >
        <h2 className="text-lg font-bold mb-3">
          📢 Información importante
        </h2>

        <p className="text-gray-700 mb-4">
          {announcement.message}
        </p>

        <button
          onClick={() => {
            handleClose();
          }}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}