import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ParameterId } from "@/types/api";

export async function PUT(req: NextRequest, { params }: ParameterId) {
  try {
    const fetchedId = parseInt(params.id);
    const participantHealthData = await req.json();

    const { ParticipantDisseases, ParticipantMedicines, ...participantHealth } =
      participantHealthData;

    const response = await prisma.participantHealth.update({
      where: {
        id: fetchedId,
      },
      data: {
        ...participantHealth,
        ParticipantDisseases: {
          create: ParticipantDisseases,
        },
        ParticipantMedicines: {
          create: ParticipantMedicines,
        },
      },
      include: {
        ParticipantDisseases: true,
        ParticipantMedicines: true,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: ParameterId) {
  try {
    const fetchedId = parseInt(params.id);
    const response = await prisma.participantHealth.delete({
      where: {
        id: fetchedId,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, { params }: ParameterId) {
  try {
    const fetchedId = parseInt(params.id);
    const user = await prisma.participantHealth.findUnique({
      where: {
        id: fetchedId,
      },
      include: {
        ParticipantDisseases: true,
        ParticipantMedicines: true,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
