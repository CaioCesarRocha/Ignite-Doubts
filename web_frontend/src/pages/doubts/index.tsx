import { GetStaticProps } from 'next'
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import {RichText} from 'prismic-dom';
import { useSession } from 'next-auth/react';
import { getPrismicClient } from '../../lib/prismic'
import styles from './styles.module.scss'
import { SendDataPrismicButton } from '../../components/SendDataPrismicButton';

type Doubt={
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}

interface DoubtsProps{
    doubts: Doubt[]
}

export default function Doubts({doubts}: DoubtsProps){
    const { data: session} = useSession();
    return(
        <>
            <Head>
                <title> Doubts | Igdoubts</title>
            </Head>

            <main className={styles.container}>
                <SendDataPrismicButton
                />
                <div className={styles.doubtsList}>
                    { doubts.map(doubt => (
                        <Link 
                            legacyBehavior 
                            href={
                                !session ? '/' :
                                session?.activeSubscription ?
                                `/doubts/${doubt.slug}` :
                                `/doubts/preview/${doubt.slug}`                
                            }
                            key={doubt.slug}    
                        >
                            <a>
                                <time>{doubt.updatedAt}</time>
                                <strong>{doubt.title}</strong>
                                <p>{doubt.excerpt}</p>
                            </a>
                        </Link>
                        ))}                        
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () =>{
    const prismic = getPrismicClient()

   
    const response = await prismic.query<any>([
            Prismic.predicates.at('document.type', 'doubts')
        ], {
        fetch: ['doubt.title', 'doubt.content'],
        pageSize: 100,
    })

    const doubts = response.results.map((doubt: any) => {
        return {
            slug: doubt.uid,
            title: RichText.asText(doubt.data.title),// \/ se o primeiro paragrafo N for um txt, passa strg vazia
            excerpt: doubt.data.content.find((content: any) => content.type === 'paragraph')?.text ?? '', //pega o 1
            updatedAt: new Date(doubt.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return{
        props:{
           doubts
        }
    }
}