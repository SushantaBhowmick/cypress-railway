import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createOrRetriveCustomer } from "@/lib/stripe/adminTasks";
import { stripe } from "@/lib/stripe";
import { getURl } from "@/lib/utils";

export async function POST(request: Request) {
  const { price, quantity = 1, metadata = {} } = await request.json();

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const customer = await createOrRetriveCustomer({
      email: user?.email || "",
      uuid: user?.id || "",
    });

    const session = await stripe.checkout.sessions.create({
      //@ts-ignore
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: { trial_from_plan: true, metadata },
      success_url: `${getURl()}/dashboard`,
      cancel_url: `${getURl()}/dashboard`,
    });
    return NextResponse.json({ sessionId: session.id });
    
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
