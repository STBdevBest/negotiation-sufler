import { AppServer, ViewType } from '@mentra/sdk';
import { sendToLLM, isLlmConfigured } from './llm/yandex.js';
const PACKAGE_NAME = process.env.PACKAGE_NAME ?? 'com.sufler.negotiation';
const MENTRAOS_API_KEY = process.env.MENTRA_API_KEY ?? '';
const PORT = parseInt(process.env.PORT || '3000', 10);
class NegotiationSufler extends AppServer {
    constructor() {
        super({
            packageName: PACKAGE_NAME,
            apiKey: MENTRAOS_API_KEY,
            port: PORT,
        });
    }
    async onSession(session, sessionId, userId) {
        session.logger.info(`User ${userId} connected`);
        if (!isLlmConfigured()) {
            session.layouts.showTextWall('Negotiation Sufler\n\nWarning: LLM not configured\nCheck MENTRA_API_KEY');
        }
        else {
            session.layouts.showTextWall('Negotiation Sufler\n\nReady\nStart speaking...');
        }
        session.events.onTranscription((data) => {
            if (!data.isFinal) {
                session.layouts.showDoubleTextWall(`You: ${data.text}...`, isLlmConfigured() ? 'Analyzing...' : 'LLM not configured', { view: ViewType.MAIN });
                return;
            }
            session.logger.info(`Final transcript: ${data.text}`);
            if (!isLlmConfigured()) {
                session.layouts.showDoubleTextWall(`You: ${data.text}`, 'LLM not configured', { view: ViewType.MAIN });
                return;
            }
            session.layouts.showDoubleTextWall(`You: ${data.text}`, 'LLM analyzing...', { view: ViewType.MAIN });
            this.handleTranscription(session, data.text).catch((e) => {
                session.logger.error(`LLM error: ${e.message}`);
                session.layouts.showDoubleTextWall(`You: ${data.text}`, `Error: ${e.message}`, { view: ViewType.MAIN });
            });
        });
    }
    async handleTranscription(session, text) {
        const advice = await sendToLLM(text);
        session.layouts.showDoubleTextWall(`You: ${text}`, advice, { view: ViewType.MAIN });
        session.logger.info(`LLM advice: ${advice}`);
    }
    async onStop(sessionId, userId, reason) {
        this.logger.info(`Session ${sessionId} ended: ${reason}`);
    }
}
const server = new NegotiationSufler();
server.start().catch(console.error);
//# sourceMappingURL=index.js.map