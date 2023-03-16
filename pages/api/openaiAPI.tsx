import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'

const configuration = new Configuration({
   apiKey:process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export default async function(req:NextApiRequest, res:NextApiResponse){
        if(!configuration.apiKey){
            res.status(500).json({
                error:'OpenAI key not configured'
            })
        }
        try{
            const completion= await openai.createEmbedding({
                model: "text-embedding-ada-002",  
                input :req.body
            })

            res.status(200).json({ result: completion.data.data});

        }catch(error:any){
            if (error.response) {
                console.error(error.response.status, error.response.data);
                res.status(error.response.status).json(error.response.data);
              } else {
                console.error(`Error with OpenAI API request: ${error.message}`);
                res.status(500).json({
                  error: {
                    message: 'An error occurred during your request.',
                  }
                });
              }
        }
}