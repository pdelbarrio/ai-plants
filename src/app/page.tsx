"use client";

import { useState } from "react";
import PlantUpload from "@/components/PlantUpload";
import PlantList from "@/components/PlantList";
import PlantModal from "@/components/PlantModal";
import { PlantResponse } from "@/interfaces/plant";

export default function Home() {
  const [selectedPlant, setSelectedPlant] = useState<
    (PlantResponse & { _id: string }) | null
  >(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePlantClick = (plant: PlantResponse & { _id: string }) => {
    setSelectedPlant(plant);
    setSelectedId(plant._id);
  };

  const handlePlantAdded = () => {
    setRefreshTrigger((prev) => prev + 1);

    fetch("/api/plants")
      .then((res) => res.json())
      .then((plants) => {
        const newest = plants.sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date },
          ) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];
        setSelectedPlant(newest);
        setSelectedId(newest._id);
      });
  };

  const handlePlantDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-[#dce8de]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-10 text-center sm:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Tu espacio botánico
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Analizador de plantas con IA
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Identifica tus plantas y consulta sus cuidados en un solo lugar.
          </p>
        </header>

        <div className="mb-10 sm:mb-12">
          <PlantUpload onPlantAdded={handlePlantAdded} />
        </div>

        <section className="rounded-2xl border border-emerald-900/15 bg-[#d3e2d6] p-5 shadow-[0_12px_40px_-24px_rgba(31,42,36,0.35)] sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Colección
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Mis Plantas
              </h2>
            </div>
          </div>
          <PlantList
            onPlantClick={handlePlantClick}
            key={refreshTrigger}
            selectedId={selectedId ?? undefined}
          />
        </section>

        {selectedPlant && (
          <PlantModal
            plant={selectedPlant}
            onClose={() => setSelectedPlant(null)}
            onDelete={handlePlantDeleted}
          />
        )}
      </div>
    </main>
  );
}
