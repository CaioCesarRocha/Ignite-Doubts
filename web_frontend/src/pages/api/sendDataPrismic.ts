import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest,res: NextApiResponse){
    if(req.method !== 'POST') 
        res.status(405).json({error: 'Method not allowed'});


    

    const dev = process.env.ENDPOINT;

    const server = dev ? process.env.ENDPOINT : 'https://your_deployment.server.com';

    const response = await fetch(`${process.env.ENDPOINT}`, {
        method: 'POST',

        headers: {
            'Authorization': `Bearer ${process.env.PRISMIC_ACCESS_TOKEN}`,
            'Host': 'if-api.prismic.io',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({            
            "id": "0",
            "title": "My Item number 0",
            "content": "Apenas testando",        
        })
    });

    console.log('responseeee', response)

    /*POST  HTTP/1.1
    Authorization: Bearer process.env.PRISMIC_ACCESS_TOKEN
    Host: if-api.prismic.io
    Content-Type: application/json
    Content-Length: 514
    [
        {
            "id": "0",
            "title": "My Item number 0",
            "content": "Apenas testando",
        },
    ]*/
    
    
    
    return res.status(200).json({
       message: 'Sent with success'
    })
}