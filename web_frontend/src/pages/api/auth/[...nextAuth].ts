import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github";
import {query as q} from 'faunadb'
import { fauna } from "../../../lib/fauna";



export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
    // ...add more providers here
  ],
    callbacks: {
      async session({session}){
        try {
          const userActiveSubscription = await fauna.query<string>(
            q.Get(
              q.Intersection([ //vai fazer 2 pesquisias e buscar os dados que batem. Tbm tem união e difference
                q.Match(
                  q.Index('subscription_by_user_ref'), //vai buscar a inscrição pelo ref do user
                  q.Select( // como não temos o ref do user na session, fazemos um selec
                    "ref", //que pega o ref do user pesquisando pelo seu email, usando o 'user_by_email' índice
                    q.Get(
                      q.Match(
                        q.Index('user_by_email'),
                        q.Casefold(session?.user?.email!)
                      )
                    )
                  )
                ),
                q.Match(
                  q.Index('subscription_by_status'),
                  "active"
                )
              ])
            )
          )
          return {
            ...session,
            activeSubscription: userActiveSubscription
          }
        } catch {
          return {
            ...session,
            activeSubscription: null
          }
        } 
      },
      async signIn( {user, account, profile}){
        const { email } = user;

        try {
          await fauna.query(
            q.If( // FUNCIONA COMO IF ELSE
              q.Not(
                q.Exists(
                  q.Match(q.Index('user_by_email'), q.Casefold(email!)),
                ),
              ),
              q.Create(
                q.Collection('users'), 
                { data: { email } }
              ),
              q.Get(
                q.Match(q.Index('user_by_email'), 
                q.Casefold(email!))
              ),
            ),
          );     
          return true;
        } catch {
          return false;
        }
      },
    }
})

