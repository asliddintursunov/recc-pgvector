import { GoogleGenAI } from '@google/genai';
import { ENV } from 'src/shared/configs';

export class EmbeddingService {
    private ai: GoogleGenAI;

    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: ENV.GEMINI_EMBEDDING_API_KEY
        });
    }

    async generateProductEmbedding(textToEmbed: string): Promise<number[]> {
        try {
            const response = await this.ai.models.embedContent({
                model: 'text-embedding-004',
                contents: textToEmbed,
            });

            const embedding = response.embeddings?.[0].values

            if (!embedding) {
                throw new Error('No embedding returned from API');
            }

            return embedding;
        } catch (error) {
            console.error('Failed to generate embedding:', error);
            throw error;
        }
    }
}