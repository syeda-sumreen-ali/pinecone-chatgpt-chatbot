import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'
import { PineconeClient } from "@pinecone-database/pinecone";

const configuration = new Configuration({
   apiKey:process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)
const pinecone = new PineconeClient();


export default async function(req:NextApiRequest, res:NextApiResponse){

    // initialize pinecone
    await pinecone.init({
        environment: String(process.env.PINECONE_ORG),
        apiKey: String(process.env.PINECONE_API_KEY)
      });

      //create index 
      await pinecone.createIndex({
        createRequest: {
          name: "prompt-index",
          dimension: 1024,
        },
      });
      //index instancce
      const index = pinecone.Index("prompt-index");
        if(!configuration.apiKey){
            res.status(500).json({
                error:'OpenAI key not configured'
            })
        }
        try{
            const completion= await openai.createEmbedding({
                "model": "text-embedding-ada-002",  
                "input" :req.body.prompt
            })
            console.log({completion})

            //upsert vector in index instance
            const upsertRequest = {
                vectors: [
                  {
                    id: "vec1",
                    values: [0.1, 0.2, 0.3, 0.4],
                    metadata: {
                      genre: "drama",
                    },
                  },
                  {
                    id: "vec2",
                    values: [0.2, 0.3, 0.4, 0.5],
                    metadata: {
                      genre: "action",
                    },
                  },
                ],
                namespace: "prompt-namespace",
              };
            const upsertResponse = await index.upsert({ upsertRequest });
            console.log(upsertResponse)
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