import {NextRequest, NextResponse} from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    let responseData = await (await fetch(`${process.env.BASE_URL}`+'xml/',{
      next:{
        revalidate:10
      }
    })).text();

    const response = new NextResponse(responseData)
    response.headers.set('content-type', 'application/xml');
    // no-cache
    response.headers.set('cache-control', 'no-cache');
    return response;
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: error}, {status: 500});
  }
}
