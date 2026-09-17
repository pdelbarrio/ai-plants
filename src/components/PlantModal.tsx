"use client";

import { PlantResponse } from "@/interfaces/plant";
import { useState } from "react";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";

interface PlantModalProps {
  plant: (PlantResponse & { _id: string }) | null;
  onClose: () => void;
  onDelete: () => void;
}

export default function PlantModal({
  plant,
  onClose,
  onDelete,
}: PlantModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!plant) return null;

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/plants?id=${plant._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la planta");
      }

      onDelete();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-emerald-900/15 bg-[#e4efe6] shadow-[0_24px_80px_-24px_rgba(15,23,42,0.45)]">
        <div className="p-5 sm:p-8">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Ficha de planta
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {plant.name}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant="difficulty"
                  value={plant.difficulty}
                  className="px-3 py-1 text-sm"
                />
                <Badge
                  variant="light"
                  value={plant.light}
                  className="px-3 py-1 text-sm"
                />
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar ficha de planta"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-6">
              <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-sm">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl border border-emerald-900/15 bg-[#d7e7da] p-5 sm:p-6">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Descripción
                </h3>
                <p className="leading-7 text-slate-600">{plant.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-emerald-900/15 bg-[#d7e7da] p-5 sm:p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Cuidados
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                      Riego
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {plant.water.map((day, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ProgressBar
                    value={plant.temperature}
                    max={40}
                    variant="amber"
                    label="Temperatura"
                    valueLabel={`${plant.temperature}°C`}
                  />
                  <ProgressBar
                    value={plant.humidity}
                    max={100}
                    variant="sky"
                    label="Humedad"
                    valueLabel={`${plant.humidity}%`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
            <Button
              variant={showDeleteConfirm ? "danger" : "secondary"}
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              {showDeleteConfirm ? "Confirmar eliminación" : "Eliminar planta"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
