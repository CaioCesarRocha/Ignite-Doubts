import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../lib/prismic"
import styles from './doubt.module.scss';

interface DoubtProps {
    doubt: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string
    }
}

export default function Doubt({doubt}: DoubtProps){
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
                        className={styles.doubtContent}
                    />
                </article>
            </main>
        </>
    )
}

    //só vai exibir se user tiver logado e com assinatura válida. Por padrão toda static page não é protegida
    //por issos erá utilizado getServerSideProps
export const getServerSideProps: GetServerSideProps = async({req, params}) =>{
    const session = await getSession({ req })

    const {slug}= params!;

    if(!session){
        return{
            redirect: {
                destination: '/',
                permanent: false, //redirecionando o user somente pq nao ta logado ou sem assinatura
            }
        }
    }
    
    const prismic = getPrismicClient(req)

    const response = await prismic.getByUID<any>('doubts', String(slug), {})

    const doubt = {
        slug, 
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date!).toLocaleDateString('pt-BR',{
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return{
        props:{
            doubt,
        }
    }
}