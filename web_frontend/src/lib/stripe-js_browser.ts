import {loadStripe} from '@stripe/stripe-js';

//PARA UTILZAR O STRIPE NO BROWSER
export async function getStripeJs(){
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

    return stripeJs;
}