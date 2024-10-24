
import { NextResponse } from 'next/server';
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { v4 as uuidv4 } from 'uuid';
import { findSubstringById } from '@/app/utils';


export async function POST(
  req: Request,
) {
  const body = await req.json();
  let { prompt, sessionId } = body;
  console.log("Prompt: ", prompt);

  const client = new BedrockAgentRuntimeClient({
    region: "us-west-2"
  });

  if (sessionId === undefined || sessionId === null || sessionId === "") {
    sessionId = uuidv4();
  }
  const command = new InvokeAgentCommand({
    agentId: "UWO1RKWHK4",
    agentAliasId: "J4JQKPQII1",
    sessionId: sessionId,
    inputText: prompt,
  })
  
  
  try {
    let completion = "";
    const response = await client.send(command)

    if (response.completion === undefined) {
      throw new Error("Completion is undefined");
    }

    for await (const chunkEvent of response.completion) {
      const chunk = chunkEvent.chunk;
      console.log(chunk);
      if (chunk === undefined) {
        throw new Error("Chunk is undefined");
      }
      const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
      completion += decodedResponse;
    }

    console.log(completion)

    let ids: any[] = [];

    const { beforeSubstring, afterSubstring} = findSubstringById(completion);

    if (afterSubstring === null) {
      ids = [];
    } else {
      const values = afterSubstring.match(/\d{12,}/g);

      // Extract only the matched IDs
      ids = values ? values.map(id => id.trim()) : [];
    }

    console.log("Extracted IDs: ", ids);

    if (!ids || ids.length != 5) {
      return NextResponse.json({ sessionId: sessionId, completion: completion, players: [] });
    }
    
    return NextResponse.json({ sessionId: sessionId, completion: beforeSubstring, players: ids });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Error" });
  }
}