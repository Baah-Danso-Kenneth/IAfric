import { PaymentConfirmationRequst } from "@/types/regular";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: PaymentConfirmationRequst = await req.json(); 

    const { r_hash } = body;

    if (!r_hash) {
      return NextResponse.json(
        { error: "Missing r_hash" }, 
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_API_URL}/payment-confirmation/`,
      { r_hash },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    const message =
      error.response?.data?.error ||
      error.response?.data ||
      error.message ||
      "Unknown error";

    return NextResponse.json(
      { error: message },
      { status: error.response?.status || 500 }
    );
  }
}
