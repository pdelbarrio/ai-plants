import { NextResponse } from "next/server";
import clientPromise from "./mongodb";
import { PlantResponse } from "@/interfaces/plant";

const client = await clientPromise;

export function cleanOpenAIResponse(response: string) {
  let cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "");

  cleaned = cleaned.trim();

  return cleaned;
}

export async function validateRequest() {
  if (!process.env.PLANTNET_API_KEY) {
    return NextResponse.json(
      { error: "PlantNet API key is not defined" },
      { status: 500 },
    );
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "MongoDB URI is not defined" },
      { status: 500 },
    );
  }
}

export async function callPlantNet(image: string): Promise<PlantResponse> {
  // Quitar prefijo data:image/...
  const base64 = image.replace(/^data:image\/\w+;base64,/, "");

  // Convertir base64 → Buffer
  const buffer = Buffer.from(base64, "base64");

  // Crear Blob para FormData
  const blob = new Blob([buffer], { type: "image/jpeg" });

  const formData = new FormData();
  formData.append("organs", "leaf");
  formData.append("images", blob, "plant.jpg");

  const response = await fetch(
    `https://my-api.plantnet.org/v2/identify/all?api-key=${process.env.PLANTNET_API_KEY}`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PlantNet error:", errorText);
    throw new Error("Error calling PlantNet API");
  }

  const data = await response.json();

  const suggestion = data?.results?.[0]?.species;

  if (!suggestion) {
    throw new Error("No plant suggestion found");
  }

  const plant: PlantResponse = {
    name: suggestion.scientificNameWithoutAuthor || "Planta desconocida",
    description:
      suggestion.description?.value || generateDescription(suggestion),
    difficulty: "medium",
    water: ["lunes", "jueves"],
    temperature: 20,
    humidity: 50,
    light: "medium",
    image,
  };

  return plant;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateDescription(species: any): string {
  const name = species.scientificNameWithoutAuthor;
  const common = species.commonNames?.[0];

  return `La planta ${common || name} pertenece a la familia ${
    species.family?.scientificName || "desconocida"
  }. Es una especie identificada por PlantNet y puede variar en apariencia según su entorno.`;
}

export async function saveToDataBase(plant: PlantResponse, image: string) {
  const db = client.db();

  try {
    const result = {
      ...plant,
      image: image,
      createdAt: new Date(),
    };
    const plantCollection = db.collection("plants");
    await plantCollection.insertOne(result);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error saving plant to database", error);
    throw error;
  }
}
