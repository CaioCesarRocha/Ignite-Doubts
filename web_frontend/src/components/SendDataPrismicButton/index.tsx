import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../lib/axios';
import { getStripeJs } from '../../lib/stripe-js_browser';
import styles from './styles.module.scss';

interface SendDataPrismicButtonProps{
    
}

export function SendDataPrismicButton({}: SendDataPrismicButtonProps){
    const {data: session} = useSession();
    const router = useRouter();

    async function handleSendData(){
        if(!session){
            alert('necessário fazer login')
            signIn('github')
            return;
        }

        console.log('session', session)

        if(!session.activeSubscription){
            alert('necessário ser inscrito')
            router.push('/')
            return;
        }

        try{
            const response = await api.post('/sendDataPrismic',{
                user: session.user
            })
            alert(`response ${ response.data.message }`)
            /*const { sessionId } = response.data;

            const stripe = await getStripeJs();
            await stripe?.redirectToCheckout({ sessionId})*/
        }catch(error){
            console.log(error)
            alert('Deu error ao enviar os dados')
        }
    }

    return(
        <button
            type="button"
            className={styles.sendDataButton}
            onClick={handleSendData}
        >
            Send
        </button>
    )
}