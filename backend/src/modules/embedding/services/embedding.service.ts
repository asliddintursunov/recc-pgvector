import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { ENV } from 'src/shared/configs';

const PRODUCT_EMBEDDING_DIMENSIONS = 1536;

@Injectable()
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
                model: 'gemini-embedding-2',
                contents: textToEmbed,
                config: {
                    outputDimensionality: PRODUCT_EMBEDDING_DIMENSIONS,
                },
            });

            const embedding = response.embeddings?.[0].values

            if (!embedding) {
                throw new Error('No embedding returned from API');
            }

            return embedding;
        } catch (error: any) {
            console.error('Failed to generate embedding:', error.message);
            throw error;
        }
    }
}
