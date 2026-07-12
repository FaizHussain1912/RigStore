import { NextResponse } from 'next/server';
import { PrismaClient } from '@rigstore/database';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Fetch AI Chatbot Settings from DB
    const settingsRec = await prisma.storeSetting.findUnique({
      where: { key: 'AI_CHATBOT_SETTINGS' }
    });

    if (!settingsRec || !settingsRec.value) {
      return NextResponse.json({ error: 'AI Chatbot not configured' }, { status: 403 });
    }

    const aiSettings = settingsRec.value as Record<string, any>;

    if (!aiSettings.enabled) {
      return NextResponse.json({ error: 'AI Chatbot is currently disabled' }, { status: 403 });
    }

    if (!aiSettings.apiKey) {
      return NextResponse.json({ error: 'API Key is missing' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(aiSettings.apiKey);
    
    const systemPrompt = `You are a helpful customer support assistant for "RigStore", a computer hardware e-commerce store in Pakistan.
You sell gaming PCs, laptops, graphic cards, processors, and accessories.
You must be polite, concise, and helpful. 
CRITICAL: You must communicate with the user in the language they speak to you in. If they speak English, reply in English. If they speak Urdu, reply in Urdu. If they speak Roman Urdu (e.g., 'kese ho bhai', 'graphics card kitne ka hai'), reply in natural Roman Urdu. Never speak Hindi, refer to it as Urdu. Keep your answers relatively short and friendly.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt
    });

    // Format history for Gemini
    // Gemini expects: { role: 'user' | 'model', parts: [{ text: '...' }] }
    let history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Gemini requires the history to start with 'user' and alternate.
    if (history.length > 0 && history[0].role === 'model') {
      history = [
        { role: 'user', parts: [{ text: 'Hello' }] },
        ...history
      ];
    }

    const chat = model.startChat({
      history: history
    });

    const userMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}
