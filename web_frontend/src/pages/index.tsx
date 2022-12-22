import Head from 'next/head';
import { GetStaticProps } from 'next';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';
import { stripe } from '../lib/stripe';

interface HomeProps{
  product:{
    priceId: string;
    amount: number
  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>
        <title> Home | ig.doubts </title>
      </Head>
      <main className={styles.containerContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome</span>
          <h1>
            Doubts about <span> Programation</span> world.
          </h1>
          <p>
            Get access to all the answers <br/>
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton 
            priceId={product.priceId}
          />
        </section>

        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async() =>{
  const price = await stripe.prices.retrieve('price_1MH3lQGlnFyGnsUxkdbmuDEL',{
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US',{
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount! / 100),
  }

  return {
    props:{
      product
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}