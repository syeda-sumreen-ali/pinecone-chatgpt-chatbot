import type { NextApiRequest, NextApiResponse } from 'next'
import { createEmbedding } from "../../utils/openai";
import { pinecone } from "../../utils/pinecone";




export default async function (req:NextApiRequest, res:NextApiResponse){
  try {
    const embedding = await createEmbedding(req.body.prompt);
    console.log(embedding)
    const vectorEmbedding = embedding.data[0]?.embedding ?? [];
    console.log("pinecode query  start...")
    try {
       
        const queryResponse = await pinecone.query({
              vector: vectorEmbedding,
              includeMetadata: true,
              topK: 3,
              includeValues: true,
            }
          );
    console.log("pinecode query success...", queryResponse)
    let data=""
    queryResponse.matches.map((item)=>{
        const temp =`<p>${item.metadata.text}</p> </br>`
        data= data + temp
    }
        
    )
  
    res.status(200).json({data});

    } catch (error) {
      console.log("ERRor pinecone", error)
    }
   
   
    
  } catch (error) {
    console.log("Error",error)
  }
 
}





