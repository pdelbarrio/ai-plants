"use client";

import { useState, useEffect } from "react";
import { PlantResponse } from "@/interfaces/plant";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

interface PlantListProps {
  onPlantClick: (plant: PlantResponse & { _id: string }) => void;
  selectedId?: string;
}

export default function PlantList({
  onPlantClick,
  selectedId,
}: PlantListProps) {
  const [plants, setPlants] = useState<(PlantResponse & { _id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    try {
      const response = await fetch("/api/plants");
      if (!response.ok) {
        throw new Error("Error al cargar las plantas");
      }
      const data = await response.json();
      setPlants(
        data.sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date },
          ) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
          <p className="text-sm text-slate-500">Cargando plantas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
        <svg
          className="mx-auto mb-4 h-12 w-12 text-rose-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-16 w-16 text-emerald-600">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-800">
          No hay plantas registradas
        </h3>
        <p className="text-sm text-slate-500">
          Sube una imagen para comenzar a analizar tus plantas
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {plants.map((plant) => (
        <Card
          key={plant._id}
          onClick={() => onPlantClick(plant)}
          className={
            plant._id === selectedId
              ? "ring-2 ring-emerald-500 ring-offset-2"
              : ""
          }
        >
          <div className="relative aspect-square">
            <img
              src={plant.image}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="p-5">
            <h3 className="mb-2 text-lg font-semibold tracking-tight text-slate-900">
              {plant.name}
            </h3>
            <p className="line-clamp-2 text-sm leading-6 text-slate-500">
              {plant.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="difficulty" value={plant.difficulty} />
              <Badge variant="light" value={plant.light} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
