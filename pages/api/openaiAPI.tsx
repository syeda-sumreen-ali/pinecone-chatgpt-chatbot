import { ulid } from "ulid";
import type { NextApiRequest, NextApiResponse } from 'next'
import { createEmbedding } from "../../utils/openai";
import { pinecone } from "../../utils/pinecone";




export default async function (req:NextApiRequest, res:NextApiResponse){
  try {
    const embedding = await createEmbedding(req.body.prompt);
    console.log(embedding)
    const vectorEmbedding = embedding.data[0]?.embedding ?? [];
    const id = ulid();
    console.log("pinecode upsert start...")
    try {
      await pinecone.upsert({
        vectors: [
          {
            id,
            values: vectorEmbedding,
            metadata: { id, text:req.body.prompt, title:req.body.title },
          },
        ],
      });
    console.log("pinecode upsert success...")
    const indexDescription = await pinecone.fetch({ids:["semantic-search-index"]})
  
    res.status(200).json({ result: {
      message:"your data has been inserted",
      details:indexDescription
    }});

    } catch (error) {
      console.log("ERRor pinecone", error)
    }
  } catch (error) {
    console.log("Error",error)
  }
}