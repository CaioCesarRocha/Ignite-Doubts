import { GetStaticProps } from "next"
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head"
import Link from "next/link"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../lib/prismic"
import styles from '../doubt.module.scss';

interface DoubtPreviewProps {
    doubt: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string
    }
}

export default function DoubtPreview({doubt}: DoubtPreviewProps){
    const { data: session} = useSession();
    const router = useRouter();

    /*useEffect(() =>{
        if(session?.activeSubscription){
            router.push(`/doubts/${doubt.slug}`)
        }
    }, [session])*/

    return(
        <>
           <Head>
                <title> {doubt.title} | IgDoubts </title>
           </Head>
            <main className={styles.container}>
                <article className={styles.doubt}>
                    <h1> {doubt.title}</h1>
                    <time>{doubt.updatedAt} </time>
                    <div 
                        dangerouslySetInnerHTML={{__html: doubt.content}}
                        className={`${styles.doubtContent} ${styles.previewContent}`}
                    />
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/" legacyBehavior>
                            <a> Subscribe Now!</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths = () =>{
    return{
        paths:[],
        fallback: 'blocking'
    }
}

    //Como a page preview é pública, pode ser gerada uma stática pra todos users da app
export const getStaticProps: GetStaticProps = async({ params}) =>{
    const {slug}= params!;

    const prismic = getPrismicClient()

    const response = await prismic.getByUID<any>('doubts', String(slug), {})

    const doubt = {
        slug, 
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0,3)),//pega apenas  os 3 primeiros itens do conteudo
        updatedAt: new Date(response.last_publication_date!).toLocaleDateString('pt-BR',{
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return{
        props:{
            doubt,
        },
        revalidate: 60 * 30 // 30 minutes
    }
}