import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {

    const session = await auth()

    if (!session?.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/account/profile/`, {
        headers: {
            Authorization: `Token ${session?.accessToken}`,
        },
    })

    if (!res.ok) {
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: res.status }
        )
    }

    const data = await res.json()

    

    return NextResponse.json(data)
}

