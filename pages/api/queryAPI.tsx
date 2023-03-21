import type { NextApiRequest, NextApiResponse } from 'next'
import { createEmbedding } from "../../utils/openai";
import { pinecone } from "../../utils/pinecone";
import axios from 'axios'
import { chatGPTTurbo } from '@/utils/gptturbo3.5';
import { similarity } from '@/utils/calculateDistance';

/**
 * 1.  first search prompt in gpt using gpt turbo 3.5 and save result in string
 * 2.  then convert the prompt into vector using embedding and search that result in ponecone db
 * 3.  convert the gpt search result into vector as well
 * 4.  now compare the distance between the gpt vector and pinecone highest score vector and send as response
 * 
 */


export default async function (req:NextApiRequest, res:NextApiResponse){
  try {
    const{ prompt, apiMessages}=req.body

    // searching in gpt model
    let chatGPTResponse= await chatGPTTurbo(apiMessages)


  // convert user input into vector

    const promptEmbedding = await createEmbedding(prompt);

    const promptVector = promptEmbedding.data[0]?.embedding ?? [];
  

    // searching query response in pinecone db
    console.log("pinecode query  start...")
    try {
       
        const queryResponse = await pinecone.query({
              vector: promptVector,
              includeMetadata: true,
              topK: 3,
              includeValues: true,
            }
          );

          
    console.log("pinecode query success...", queryResponse.matches.length)
 
    
    const pineconeResponse = queryResponse.matches[0].metadata.text;
   
    // calculate similarity b.w pinecone and user query
    const pineconeScore = similarity(pineconeResponse, prompt);
   
    // calculate similarity b.w chatgpt and user query

    const chatGPTScore = similarity(chatGPTResponse, prompt);

        
    // comparing chatgpt and pinecone similarity score

    if (pineconeScore > chatGPTScore) {
      res.status(200).json({data:pineconeResponse});
      console.log('Pinecone DB response is closer to user query');
    } else {
      res.status(200).json({data:chatGPTResponse});
      console.log('ChatGPT Turbo 3.5 response is closer to user query');
    }

    } catch (error) {
      console.log("ERRor pinecone", error)
    }
   
   
    
  } catch (error) {
    console.log("Error",error)
  }
 
}





