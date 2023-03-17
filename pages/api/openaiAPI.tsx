import { ulid } from "ulid";
// import { Configuration, OpenAIApi } from "openai";
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


    } catch (error) {
      console.log("ERRor pinecone", error)
    }
   
    res.status(200).json({ result: "your data has been inserted"});
    
  } catch (error) {
    console.log("Error",error)
  }
 
// return {message:"your data has been inserted"}
  // export const getEmbeddingList= async (req:NextApiRequest, res:NextApiResponse)=>{

  // }
  
  
        // if(!configuration.apiKey){
        //     res.status(500).json({
        //         error:'OpenAI key not configured'
        //     })
        // }
        // try{
        //     const completion= await openai.createEmbedding({
        //         "model": "text-embedding-ada-002",  
        //         "input" :req.body.prompt
        //     })
           
        //     // res.status(200).json({ result: completion.data.data.length});
        //     // let data = completion.data.data
        //     const index_name = 'my_index';
        //     const data = [
        //       { id: '1', vector: [0.1, 0.2, 0.3] },
        //       { id: '2', vector: [0.4, 0.5, 0.6] },
        //       { id: '3', vector: [0.7, 0.8, 0.9] },
        //     ];
        //     const index = await client.create_index({ name: index_name });
        //     await index.upsert(data);
        //     const indexesList = await pinecone.listIndexes();
        //     console.log(indexesList)
        //   //   let indexData=[]
        //   // for (const iterator of data) {
        //   //   let count=1;
        //   //   indexData.push({id:String(count),values: iterator})
        //   //   count ++;
        //   // }

        //   // console.log({indexData})

        //   //create index 
        //   // await pinecone.createIndex({
        //   //   createRequest: {
        //   //     name: "prompt-index",
        //   //     dimension: 1024,
        //   //   },
        //   // });
        //   // const index = pinecone.Index("prompt-index");
        //   // console.log({index})
        //   // const upsertResponse = await index.upsert({ upsertRequest:{vectors:indexData} });
        //     // console.log(upsertResponse)
        //   // const index = await client.create_index({ name: index_name });
        //   // await index.upsert(data)

        // }catch(error:any){
        //     if (error.response) {
        //         console.error(error.response.status, error.response.data);
        //         res.status(error.response.status).json(error.response.data);
        //       } else {
        //         console.error(`Error with OpenAI API request: ${error.message}`);
        //         res.status(500).json({
        //           error: {
        //             message: 'An error occurred during your request.',
        //           }
        //         });
        //       }
        // }
}