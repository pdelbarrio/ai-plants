import { NextResponse } from "next/server";
import {
  validateRequest,
  saveToDataBase,
  callPlantNet,
} from "@/lib/plantsHooks";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Plant {
  image: string;
}

const client = await clientPromise;

export async function POST(request: Request) {
  const validationError = await validateRequest();
  if (validationError) return validationError;

  const body: Plant = await request.json();
  const { image } = body;

  if (!image) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  try {
    const plant = await callPlantNet(image);
    const result = await saveToDataBase(plant, image);
    return result;
  } catch (error) {
    console.error("Error processing plant", error);
    return NextResponse.json(
      { error: "Error processing plant" },
      { status: 500 },
    );
  }
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
    console.error("Error fetching plants", error);
    return NextResponse.json(
      { error: "Error fetching plants" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const db = client.db();
  const plantsCollecction = db.collection("plants");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await plantsCollecction.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Plant deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting plant", error);
    return NextResponse.json(
      { error: "Error deleting plant" },
      { status: 500 },
    );
  }
}
