import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {config as dotenvConfig} from 'dotenv'
import { EmbeddingCosineService } from '../utils/Embedding.coseno';
import { ConsultDto } from './dto/consults.dto';
dotenvConfig({ path: '.development.env' });


@Injectable()
export class ConsultsService {

  constructor(
    private readonly embeddingCoseno: EmbeddingCosineService,
  ){}

  async consultProduct(consultUser: ConsultDto) {

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // model embedding-001
    const modelEmbedding = genAI.getGenerativeModel({ model: "embedding-001"});
    
    try {
      // question to embedding
      const questionToEmbedding = await modelEmbedding.embedContent(consultUser.consult);
      const questionEmbedding = await questionToEmbedding.embedding.values;      
      
      // buscando matchs de embeddings en DB
      const embeddingsMatch = await this.embeddingCoseno.calculateEmbeddingCosineDistance(questionEmbedding, "descriptionEmbedding");
      const embeddingsResult = embeddingsMatch.map((product) => ({ result: product.description }) );

      return embeddingsResult;
      
    } catch (error) {

      throw error;      
    }
    
  }
}
