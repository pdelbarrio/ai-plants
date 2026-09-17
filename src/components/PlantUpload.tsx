"use client";

import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";

interface PlantUploadProps {
  onPlantAdded: () => void;
}

export default function PlantUpload({ onPlantAdded }: PlantUploadProps) {
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la imagen");
      }

      setImage("");
      onPlantAdded();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-5 sm:p-8">
        <div className="mb-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Nueva identificación
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Añadir Nueva Planta
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sube una fotografía clara para obtener un análisis detallado.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            className={`relative rounded-xl border border-dashed p-7 transition-all duration-200 sm:p-8 ${
              isDragging
                ? "border-emerald-500 bg-emerald-50"
                : "border-emerald-900/20 bg-[#dceade] hover:border-emerald-400 hover:bg-[#d4e7d8]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 text-emerald-600">
                <svg
                  className="w-full h-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-slate-600">
                Arrastra una imagen aquí o{" "}
                <span className="font-semibold text-emerald-700">
                  selecciona un archivo
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                PNG, JPG o JPEG (máx. 5MB)
              </p>
            </div>
          </div>

          <div
            className={`relative rounded-xl border border-dashed p-7 transition-all duration-200 sm:p-8 ${
              isDragging
                ? "border-emerald-500 bg-emerald-50"
                : "border-emerald-900/20 bg-[#dceade] hover:border-emerald-400 hover:bg-[#d4e7d8]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />
            <div className="text-center">
              {/* ... tu contenido actual ... */}
            </div>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#edf5ee]/90">
                <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {image && (
            <div className="relative group">
              <img
                src={image}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
              <button
                type="button"
                onClick={() => setImage("")}
                aria-label="Quitar vista previa"
                className="absolute right-3 top-3 rounded-full bg-white p-2.5 text-slate-500 shadow-md opacity-0 transition-all duration-200 hover:text-emerald-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 group-hover:opacity-100"
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
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-800">
              Planta añadida correctamente 🌱
            </div>
          )}

          <Button
            className="w-full sm:w-auto"
            type="submit"
            disabled={!image}
            isLoading={loading}
          >
            {loading ? "Procesando..." : "Analizar Planta"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
