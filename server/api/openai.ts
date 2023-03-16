import { Configuration, OpenAIApi } from "openai";

export default defineEventHandler(async (event) => {
  const { OPENAI_KEY, OPENAI_URL } = useRuntimeConfig();

  const { messages } = getQuery(event);

  const configuration = new Configuration({
    apiKey: OPENAI_KEY,
    basePath: OPENAI_URL,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo",
      stream: true,
      messages: JSON.parse(decodeURIComponent(messages! as string)),
      temperature: 0,
      max_tokens: 100,
    },
    { responseType: "stream" }
  );
  console.log("ok");
  setResponseHeader(event, "Content-Type", "text/event-stream");
  return sendStream(event, response.data);
});
