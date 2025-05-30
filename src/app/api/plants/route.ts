import { NextResponse } from "next/server";
import {
  callOpenAI,
  validateRequest,
  cleanOpenAIResponse,
  saveToDataBase,
} from "@/lib/plantsHooks";
import { PlantResponse } from "@/interfaces/plant";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Plant {
  image: string;
}

const client = await clientPromise;

export async function POST(request: Request) {
  const validationError = await validateRequest();

  if (validationError) {
    return validationError;
  }

  const body: Plant = await request.json();
  const { image } = body;

  if (!image) {
    return NextResponse.json(
      {
        error: "Image is required",
      },
      {
        status: 400,
      }
    );
  }

  const response = await callOpenAI(image);

  if (!response) {
    throw new Error("No response from OpenAI");
  }

  let plant: PlantResponse;

  try {
    const cleanedResponse = cleanOpenAIResponse(response);
    plant = JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Error parsing plant from OpenAI response", error);
    throw error;
  }

  const result = await saveToDataBase(plant, image);

  return result;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const db = client.db();

    const plantsCollecction = db.collection("plants");

    if (!id) {
      const plants = await plantsCollecction.find().toArray();
      return NextResponse.json(plants);
    }

    const plant = await plantsCollecction.findOne({ _id: new ObjectId(id) });

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    return NextResponse.json(plant);
  } catch (error) {
    console.error("Error fetching pants", error);
    return NextResponse.json(
      {
        error: "Error fetching plants",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {}
