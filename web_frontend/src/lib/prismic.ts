import * as Prismic from '@prismicio/client'

export function getPrismicClient(req?:unknown) {
    const prismic = Prismic.default.client(
        process.env.PRISMIC_ENTRYPOINT!,
        {   
            req,
            accessToken: process.env.PRISMIC_ACCESS_TOKEN
        }
    )

    return prismic
}