"use client";

import { useCallback, useRef, useState } from "react";
import { faqApiClient } from "@/lib/chatbot/faq-api-client";
import type { MessageProvider } from "@/lib/chatbot/message-provider";
import type {
  Category,
  ChatFlowStep,
  ChatMessage,
  ChatSelectionContext,
  FaqQuestion,
  Subcategory,
} from "@/lib/chatbot/types";

const BOT_NAME = "Support Assistant";
const TYPING_DELAY_MS = 900;

function createMessage(
  role: ChatMessage["role"],
  content: string,
  meta?: ChatMessage["meta"]
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
    meta,
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface UseChatbotOptions {
  provider?: MessageProvider;
}

export function useChatbot(hookOptions: UseChatbotOptions = {}) {
  const provider = hookOptions.provider ?? faqApiClient;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [flowStep, setFlowStep] = useState<ChatFlowStep>("categories");
  const [context, setContext] = useState<ChatSelectionContext>({});
  const [flowOptions, setFlowOptions] = useState<
    Array<Category | Subcategory | FaqQuestion>
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializedRef = useRef(false);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const botSay = useCallback(
    async (content: string, meta?: ChatMessage["meta"]) => {
      setIsTyping(true);
      await delay(TYPING_DELAY_MS);
      setIsTyping(false);
      appendMessage(createMessage("bot", content, meta));
    },
    [appendMessage]
  );

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const categories = await provider.getCategories();
      setFlowOptions(categories);
      setFlowStep("categories");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load categories");
      setFlowOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  const startConversation = useCallback(async () => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    await botSay(
      `Hello! I'm ${BOT_NAME}. Choose a topic below to get started.`
    );
    await loadCategories();
  }, [botSay, loadCategories]);

  const openChat = useCallback(() => {
    setIsOpen(true);
    void startConversation();
  }, [startConversation]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const resetFlow = useCallback(async () => {
    appendMessage(createMessage("user", "Start over"));
    await botSay("Sure! Pick a topic to continue.");
    setContext({});
    await loadCategories();
  }, [appendMessage, botSay, loadCategories]);

  const selectCategory = useCallback(
    async (category: Category) => {
      appendMessage(createMessage("user", category.name, { categoryId: category.id }));
      setContext({ category });
      setIsLoading(true);
      setError(null);
      setFlowOptions([]);

      try {
        await botSay(`Great choice. What about ${category.name}?`, {
          categoryId: category.id,
          flowStep: "subcategories",
        });
        const subcategories = await provider.getSubcategories(category.id);
        setFlowOptions(subcategories);
        setFlowStep("subcategories");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load subcategories");
      } finally {
        setIsLoading(false);
      }
    },
    [appendMessage, botSay, provider]
  );

  const selectSubcategory = useCallback(
    async (subcategory: Subcategory) => {
      appendMessage(
        createMessage("user", subcategory.name, { subcategoryId: subcategory.id })
      );
      setContext((prev) => ({ ...prev, subcategory }));
      setIsLoading(true);
      setError(null);
      setFlowOptions([]);

      try {
        await botSay("Here are common questions. Tap one to see the answer.", {
          subcategoryId: subcategory.id,
          flowStep: "questions",
        });
        const questions = await provider.getQuestions(subcategory.id);
        setFlowOptions(questions);
        setFlowStep("questions");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load questions");
      } finally {
        setIsLoading(false);
      }
    },
    [appendMessage, botSay, provider]
  );

  const selectQuestion = useCallback(
    async (question: FaqQuestion) => {
      appendMessage(
        createMessage("user", question.question, { faqId: question.id })
      );
      setIsLoading(true);
      setError(null);
      setFlowOptions([]);

      try {
        const faq = await provider.getAnswer(question.id);
        await botSay(faq.answer, {
          faqId: faq.id,
          flowStep: "answered",
        });
        setFlowStep("answered");
        await loadCategories();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load answer");
      } finally {
        setIsLoading(false);
      }
    },
    [appendMessage, botSay, loadCategories, provider]
  );

  const handleOptionSelect = useCallback(
    (item: Category | Subcategory | FaqQuestion) => {
      if (flowStep === "categories") {
        void selectCategory(item as Category);
      } else if (flowStep === "subcategories") {
        void selectSubcategory(item as Subcategory);
      } else if (flowStep === "questions") {
        void selectQuestion(item as FaqQuestion);
      } else if ("question" in item) {
        void selectQuestion(item as FaqQuestion);
      }
    },
    [flowStep, selectCategory, selectSubcategory, selectQuestion]
  );

  return {
    botName: BOT_NAME,
    isOpen,
    openChat,
    closeChat,
    messages,
    options: flowOptions,
    flowStep,
    isTyping,
    isLoading,
    error,
    handleOptionSelect,
    resetFlow,
    context,
  };
}
