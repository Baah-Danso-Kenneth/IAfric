import axios from "axios";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {searchParams} = new URL(request.url);
    const invoiceId = searchParams.get("id");

    if(!invoiceId){
        return NextResponse.json({error:"Missing invoice ID"}, {status: 400})
    }

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/generate-invoice/`,{
            headers: {
                Authorizatioon: `Bearer ${process.env.LIGHTNING_API_KEY}`,
            },
        });
        return NextResponse.json({paid: response.data.paid})

    } catch (error:any) {
        return NextResponse.json(
            {error: error.response?.data?.error || "Failed to checkpayment status"},
            {status: 500}
        )
    }
}