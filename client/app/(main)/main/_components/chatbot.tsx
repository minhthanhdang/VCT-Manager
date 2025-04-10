"use client"

import * as z from "zod"
import { toast } from "sonner"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { formSchema } from "../constant"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormItem } from "@/components/ui/form"
import { FormField } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import axios from "axios";
import { Message } from "./message"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

type ChatMessage = {
  role: "user" | "agent",
  message: string
}

const test_messages: ChatMessage[] = [
  { role: "user", message: "Hiii there!" },
  { role: "agent", message: "Greetings, I'm a Valorant Professional Manager! How can I help you today?" }
]

interface ChatBotProps {
  setPlayerIds: (players: any[]) => void;
  playerIds: any[];
  setSession: (sessionId: string) => void;
}

const ChatBot = ({
  setPlayerIds,
  playerIds,
  setSession
} : ChatBotProps) => {

  const [messages, setMessages] = useState<ChatMessage[]>(test_messages);
  const [sessionId, setSessionId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try{
      const response = await axios.post("/api/invokeAgent", {
        prompt: values.prompt,
        sessionId: sessionId,
        ids: playerIds
      })
      console.log(response);
      if ("error" in response.data) {
        console.log(response.data.error);
        toast("Please try again", {
          description: response.data.error
        })
        return;
      } else {
        setMessages((current) => [...current,{ role: "user", message: values.prompt}, { role: "agent", message: response.data.completion }])
        setSessionId(response.data.sessionId);
        setSession(response.data.sessionId);
        if (response.data.players && response.data.players.length > 0) {
          setPlayerIds(response.data.players);
        } 
      }
      
      console.log(isLoading)
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="flex col-span-6 h-full relative overflow-hidden bg-black">
      {isLoading && (
        <div className="z-40 absolute top-0 left-0 w-full h-full bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-[#ff4655] text-[36px]">I'm Thinking</div>
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-accent"></div>
        </div>
      )}
      <Form {...form}>
        
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative border-2 border-accent w-full h-full flex flex-col gap-4 pb-6"
        >
          <div className="relative h-full flex-grow flex flex-col gap-4 p-6 rounded-lg overflow-y-scroll border-b-2 border-accent scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <div className="relative h-full flex-grow flex flex-col gap-4 py-4 rounded-lg">
              {messages.length === 0 && !isLoading && (
                <div className="text-black">No messages yet.</div>
              )}
              {messages.map((message) => (
                <div key={message.message} className={cn(
                  "w-full flex ",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}>
                  <Message role={message.role} message={message.message} />
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full px-4 flex flex-col gap-4 justify-right">
            <FormField 
              name="prompt"
              render={({ field }) => (
                <FormItem className="relative w-full border rounded-lg ">
                  <FormControl className="relative w-full">
                    <Textarea 
                      className="relative w-full border-accent border-[1.5px] outline-none focus-visible:ring-0 focus-visible:ring-transparent text-wrap h-[40px]"
                      disabled={isLoading}
                      placeholder="Create the best Valorant team for me!"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="bg-accent hover:bg-secondary hover:text-black">
              Generate
            </Button>
          </div>
        </form>

        
      </Form>
    </div>
  )
}

export default ChatBot