import Stripe from 'stripe';
import {version} from '../../package.json'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
    appInfo:{
        name: 'Ignite Shop',
        version
    }
})