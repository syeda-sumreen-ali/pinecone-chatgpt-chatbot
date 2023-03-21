const MODEL = "gpt-3.5-turbo";

export async function chatGPTTurbo(body:any) {
    
     const systemMessage={
        role:"system",
        content:"answer only to sales related questions"
      }
    const apiRequestBody = {
        "model": MODEL,
        "messages": [
          systemMessage,  // The system message DEFINES the logic of our chatGPT
          ...body // The messages from our chat with ChatGPT
        ]
      }

      console.log({apiRequestBody})
  let data=  await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " +  process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
        console.log(data)
        return data.choices[0]?.message?.content || ""
    }).catch(err=>console.log(err.message));
    
    return data;
}
