import { PineconeClient } from "pinecone-client";

export type Metadata= {
     id:string;
     text:string;
     title:string;
 }

export const pinecone = new PineconeClient<Metadata>({
apiKey: process.env.PINECONE_API_KEY,
baseUrl: process.env.PINECONE_BASE_URL,
namespace:"semantic-search-index"
});
      