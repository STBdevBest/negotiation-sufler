"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@mentra/sdk");
const yandex_1 = require("./llm/yandex");
const PACKAGE_NAME = process.env.PACKAGE_NAME ?? 'com.sufler.negotiation';
const MENTRAOS_API_KEY = process.env.MENTRA_API_KEY ?? '';
const PORT = parseInt(process.env.PORT || '3000', 10);
class NegotiationSufler extends sdk_1.AppServer {
    constructor() {
        super({
            packageName: PACKAGE_NAME,
            apiKey: MENTRAOS_API_KEY,
            port: PORT,
        });
    }
    async onSession(session, sessionId, userId) {
        session.logger.info(`User ${userId} connected`);
        if (!(0, yandex_1.isLlmConfigured)()) {
            session.layouts.showTextWall('Negotiation Sufler\n\nWarning: LLM not configured\nCheck MENTRA_API_KEY');
        }
        else {
            session.layouts.showTextWall('Negotiation Sufler\n\nReady\nStart speaking...');
        }
        session.events.onTranscription((data) => {
            if (!data.isFinal) {
                session.layouts.showDoubleTextWall(`You: ${data.text}...`, (0, yandex_1.isLlmConfigured)() ? 'Analyzing...' : 'LLM not configured', { view: sdk_1.ViewType.MAIN });
                return;
            }
            session.logger.info(`Final transcript: ${data.text}`);
            if (!(0, yandex_1.isLlmConfigured)()) {
                session.layouts.showDoubleTextWall(`You: ${data.text}`, 'LLM not configured', { view: sdk_1.ViewType.MAIN });
                return;
            }
            session.layouts.showDoubleTextWall(`You: ${data.text}`, 'LLM analyzing...', { view: sdk_1.ViewType.MAIN });
            this.handleTranscription(session, data.text).catch((e) => {
                session.logger.error(`LLM error: ${e.message}`);
                session.layouts.showDoubleTextWall(`You: ${data.text}`, `Error: ${e.message}`, { view: sdk_1.ViewType.MAIN });
            });
        });
    }
    async handleTranscription(session, text) {
        const advice = await (0, yandex_1.sendToLLM)(text);
        session.layouts.showDoubleTextWall(`You: ${text}`, advice, { view: sdk_1.ViewType.MAIN });
        session.logger.info(`LLM advice: ${advice}`);
    }
    async onStop(sessionId, userId, reason) {
        this.logger.info(`Session ${sessionId} ended: ${reason}`);
    }
}
const server = new NegotiationSufler();
server.start().catch(console.error);
//# sourceMappingURL=index.js.map