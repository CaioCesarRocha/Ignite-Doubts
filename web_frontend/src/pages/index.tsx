import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';

export default function Home() {
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
            <span>for $9.90 month</span>
          </p>
          <SubscribeButton/>
        </section>

        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>
    </>
  )
}
