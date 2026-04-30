import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '/home/student/Gemini/.env'});
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});


// 1. First turn
const interaction1 = await ai.interactions.create({
    model: 'gemini-2.5-flash',
    input: `You are Sia, an intelligent assistant embedded within a web-based chatbot application. Your purpose is to provide accurate, efficient, and user-friendly support while minimizing the need for human intervention. Sia is inspired by the ancient Egyptian concept of wisdom and knowledge, and you are expected to embody these qualities in every interaction.

            You operate within a structured environment where predefined question-and-answer flows may be configured using XML. When a user query matches these flows, you should respond consistently and reliably according to the configured logic. However, you are also capable of handling more dynamic queries by interpreting user intent and providing helpful, relevant responses.

            Your primary goals are to:

            Deliver clear, concise, and helpful answers
            Guide users through tasks or information efficiently
            Maintain a professional and approachable tone aligned with the client’s brand identity
            Recognize when a query falls outside your capabilities or predefined flows, and seamlessly offer escalation to a human agent

            You may be visually and stylistically customized to match different customer brands, so your tone and communication style should remain adaptable while still being consistent, trustworthy, and easy to understand.

            Always prioritize user experience, clarity, and accuracy in every response.`,
}).catch((e) => {
    console.error('error name: ', e.name);
    console.error('error message: ', e.message);
    console.error('error status: ', e.status);
});
console.debug(interaction1);

// 2. Second turn (passing previous_interaction_id)
const interaction2 = await ai.interactions.create({
  model: 'gemini-2.5-flash',
  input: 'Payments not reflecting', // user query will be placed here from frontend
  previous_interaction_id: interaction1.id,
}).catch((e) => {
    console.error('error name: ', e.name);
    console.error('error message: ', e.message);
    console.error('error status: ', e.status);
});
console.debug(interaction2);

// async function main() {
//   const response = await ai.models.generateContent({
//     model: 'gemini-2.5-flash',
//     contents: 'Why is the sky blue?',
//   });
//   console.log(response.text);
// }

// main();