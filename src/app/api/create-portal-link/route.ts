import { stripe } from "@/lib/stripe";
import { createOrRetriveCustomer } from "@/lib/stripe/adminTasks";
import { getURl } from "@/lib/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabse = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabse.auth.getUser();

    if (!user) throw new Error("could not find the user");

    const customer = await createOrRetriveCustomer({
      email: user.email || "",
      uuid: user.id || "",
    });
    if (!customer) throw new Error("No Customer");
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURl()}/dashboard`,
    });
    return NextResponse.json({ url });
  } catch (error) {
    console.log("ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
