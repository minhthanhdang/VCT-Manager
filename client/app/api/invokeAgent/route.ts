import { NextResponse } from "next/server";
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { v4 as uuidv4 } from "uuid";
import { findSubstringById } from "@/app/utils";

export async function POST(req: Request) {
  const body = await req.json();

  let { prompt, sessionId, ids } = body;
  console.log("Prompt: ", prompt);

  const client = new BedrockAgentRuntimeClient({
    region: "us-west-2",
  });

  if (sessionId === undefined || sessionId === null || sessionId === "") {
    sessionId = uuidv4();
  }

  let idsString = "";
  if (ids === undefined || ids === null || ids.length === 0) {
    ids = [];
  } else {
    idsString = ids.join(", ");
    idsString =
      "Here are the IDs of current players on the team: " + idsString + ". ";
  }

  let input_prompt = prompt + "\n" + idsString;
  const command = new InvokeAgentCommand({
    agentId: "F3AX09JOGV",
    agentAliasId: "0YNAEK6UJJ",
    sessionId: sessionId,
    inputText: input_prompt,
  });

  console.log(input_prompt);
  return NextResponse.json({
    sessionId: sessionId,
    completion: "Hello this is blocked",
    players: [],
  });
  try {
    let completion = "";
    const response = await client.send(command);

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

    console.log(completion);

    let new_ids: any[] = [];

    const { beforeSubstring, afterSubstring } = findSubstringById(completion);

    if (afterSubstring === null) {
      new_ids = [];
    } else {
      const values = afterSubstring.match(/\d{12,}/g);

      // Extract only the matched IDs
      new_ids = values ? values.map((id) => id.trim()) : [];
    }

    console.log("Extracted IDs: ", new_ids);

    if (!new_ids || new_ids.length != 5) {
      return NextResponse.json({
        sessionId: sessionId,
        completion: completion,
        players: [],
      });
    }

    return NextResponse.json({
      sessionId: sessionId,
      completion: beforeSubstring,
      players: new_ids,
    });
  } catch (err: any) {
    console.log(err.message);
    if (err.message.includes("Your request rate is too high")) {
      return NextResponse.json({ error: "Agent throttling error" });
    }
    return NextResponse.json({ error: "Error" });
  }
}
