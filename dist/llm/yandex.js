"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToLLM = sendToLLM;
exports.isLlmConfigured = isLlmConfigured;
exports.clearConversation = clearConversation;
const config_1 = require("../config");
const YANDEX_API_BASE = 'https://llm.api.cloud.yandex.net/foundationModels/v1';
let conversationHistory = [];
async function sendToLLM(userMessage) {
    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;
    const modelId = process.env.YANDEX_MODEL_ID || 'yandexgpt-lite';
    if (!apiKey || !folderId) {
        throw new Error('Yandex API not configured');
    }
    conversationHistory.push({ role: 'user', content: userMessage });
    while (conversationHistory.length > 20) {
        conversationHistory.shift();
    }
    const modelUri = `gpt://${folderId}/${modelId}`;
    const response = await fetch(`${YANDEX_API_BASE}/completion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Api-Key ${apiKey}`,
        },
        body: JSON.stringify({
            modelUri,
            completionOptions: {
                stream: false,
                temperature: 0.6,
                maxTokens: 200,
            },
            messages: [
                { role: 'system', content: config_1.SYSTEM_PROMPT },
                ...conversationHistory,
            ],
        }),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Yandex API: ${response.status} ${text}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await response.json();
    const assistantText = data.result?.alternatives?.[0]?.message?.content?.trim() ||
        'No response from assistant';
    conversationHistory.push({ role: 'assistant', content: assistantText });
    return assistantText;
}
function isLlmConfigured() {
    return !!(process.env.YANDEX_API_KEY && process.env.YANDEX_FOLDER_ID);
}
function clearConversation() {
    conversationHistory = [];
}
//# sourceMappingURL=yandex.js.map