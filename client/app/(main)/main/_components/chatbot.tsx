"use client";

import * as z from "zod";
import { toast } from "sonner";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { formSchema } from "../constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Message } from "./message";
import { cn } from "@/lib/utils";

import AutoTextarea from "@/components/auto-textarea";
import { messages as mmm } from "@/constants/messages";
type ChatMessage = {
  role: "user" | "agent";
  message: string;
};

interface ChatBotProps {
  setPlayerIds: (players: any[]) => void;
  playerIds: any[];
  setSession: (sessionId: string) => void;
}

const ChatBot = ({ setPlayerIds, playerIds, setSession }: ChatBotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(mmm);
  const [sessionId, setSessionId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const response = await axios.post("/api/invokeAgent", {
        prompt: values.prompt,
        sessionId: sessionId,
        ids: playerIds,
      });
      console.log(response);
      if ("error" in response.data) {
        console.log(response.data.error);
        toast("Please try again", {
          description: response.data.error,
        });
        return;
      } else {
        setMessages((current) => [
          ...current,
          { role: "user", message: values.prompt },
          { role: "agent", message: response.data.completion },
        ]);
        setSessionId(response.data.sessionId);
        setSession(response.data.sessionId);
        if (response.data.players && response.data.players.length > 0) {
          setPlayerIds(response.data.players);
        }
      }

      console.log(isLoading);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-full relative overflow-hidden pt-4">
      {isLoading && (
        <div className="z-40 absolute top-0 left-0 w-full h-full bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-[#ff4655] text-[36px]">I'm Thinking</div>
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-accent"></div>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full h-full flex flex-col gap-4 pb-6 overflow-hidden"
        >
          <div className="relative w-full h-full overflow-hidden py-6 shadow-md">
            <div className="absolute bottom-0 left-0 w-full h-2 opacity-20 blur-md"></div>
            <div className="relative w-full h-full flex-grow flex flex-col gap-4 px-4 rounded-lg overflow-y-scroll  scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-background">
              {messages.length === 0 && !isLoading && (
                <div className="text-black">No messages yet.</div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-full flex ",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <Message role={message.role} message={message.message} />
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full px-4 flex flex-col gap-4 justify-right">
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <FormControl className="relative w-full">
                    <AutoTextarea onSubmit={onSubmit} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChatBot;
