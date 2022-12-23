import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../lib/axios';
import { getStripeJs } from '../../lib/stripe-js_browser';
import styles from './styles.module.scss';

interface SubscribeButtonProps{
    priceId: string
}

export function SubscribeButton({priceId}: SubscribeButtonProps){
    const {data: session} = useSession();
    const router = useRouter();

    async function handleSubscribe(){
        if(!session){
            signIn('github')
            return;
        }

        if(session.activeSubscription){
            router.push('/doubts')
            return;
        }

        try{
            const response = await api.post('/subscribe',{
                user: session.user
            })
            const { sessionId } = response.data;

            const stripe = await getStripeJs();
            await stripe?.redirectToCheckout({ sessionId})
        }catch(error){
            console.log(error)
            alert('Deu error ao inscrever')
        }
    }

    return(
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}