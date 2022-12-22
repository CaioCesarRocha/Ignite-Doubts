import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../lib/fauna";
import {query as q} from 'faunadb';
import { stripe } from "../../lib/stripe";

type User={
    ref:{
        id: string;
    },
    data:{
        stripe_customer_id: string
    }
}

export default async function handler(req: NextApiRequest,res: NextApiResponse){
    if(req.method !== 'POST') 
        res.status(405).json({error: 'Method not allowed'});

    const email = await req.body.user.email;

    const user = await fauna.query<User>(
        q.Get(
            q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
            )
        )
    )

    let customerId = user.data.stripe_customer_id;

    if(!customerId){
       
        const stripeCustomer = await stripe.customers.create({
            email,
        })
    
        await fauna.query(
            q.Update(
                q.Ref(q.Collection('users'), user.ref.id),
                {
                    data: {
                        stripe_customer_id: stripeCustomer.id
                    }
                }
            )
        )

        customerId = stripeCustomer.id
    }
    
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
        success_url: process.env.STRIPE_SUCCESS_URL!, //redireciona o user dps de uma compra de sucesso
        cancel_url: process.env.STRIPE_CANCEL_URL!, //redireciona o user dps de uma compra que ele cancelou
      
        customer: customerId,//ATENÇÃO!!, É O CUSTOME QUE É CRIADO NO STRIPE, E NAO O CUSTOMER SALVO NO BANCO
        payment_method_types: ['card'],
        billing_address_collection: 'required',//obriga user a digitar endereço 
        line_items: [
            {
                price:"price_1MH3lQGlnFyGnsUxkdbmuDEL",
                quantity: 1,
            }
        ],
        mode: 'subscription', //não é todo de uma vez, será todo mês
        allow_promotion_codes: true, // PERMITE USER USAR CUPOMS DE CODIGO POR EX
    })

    return res.status(200).json({
        sessionId: stripeCheckoutSession.id,
    })
}