import { invokeLLM } from '../_core/llm';

export interface SecaoPeticao {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: 'qualificacao' | 'fatos' | 'direito' | 'provas' | 'pedidos' | 'outro';
  ordem: number;
}

export interface AnalisePeticao {
  secoes: SecaoPeticao[];
  partes: {
    autor?: string;
    reu?: string;
    outros?: string[];
  };
  resumo: string;
  numeroProcesso?: string;
  tribunal?: string;
  vara?: string;
}

/**
 * Analisa a estrutura de uma petição inicial usando IA
 * @param textoPeticao Texto extraído da petição
 * @returns Análise estruturada da petição
 */
export async function analisarEstruturaPeticao(textoPeticao: string): Promise<AnalisePeticao> {
  try {
    const systemPrompt = `Você é um assistente jurídico especializado em análise de petições iniciais brasileiras.
Sua tarefa é analisar o texto de uma petição inicial e identificar sua estrutura, extraindo:
1. Partes envolvidas (Autor, Réu)
2. Seções da petição (Qualificação, Fatos, Direito, Provas, Pedidos)
3. Número do processo (se houver)
4. Tribunal e Vara
5. Resumo do caso

Retorne um JSON estruturado com essas informações.`;

    const userPrompt = `Analise a seguinte petição inicial e extraia sua estrutura:

${textoPeticao.substring(0, 15000)} 

${textoPeticao.length > 15000 ? '\n\n[TEXTO TRUNCADO - Continua...]' : ''}

Retorne um JSON no seguinte formato:
{
  "partes": {
    "autor": "Nome completo do autor",
    "reu": "Nome completo do réu",
    "outros": []
  },
  "numeroProcesso": "Número do processo se houver",
  "tribunal": "Nome do tribunal",
  "vara": "Nome da vara",
  "resumo": "Resumo em 2-3 frases do que se trata a ação",
  "secoes": [
    {
      "id": "secao_1",
      "titulo": "Qualificação das Partes",
      "tipo": "qualificacao",
      "ordem": 1,
      "conteudo": "Resumo do conteúdo desta seção"
    },
    {
      "id": "secao_2",
      "titulo": "Dos Fatos",
      "tipo": "fatos",
      "ordem": 2,
      "conteudo": "Resumo dos fatos narrados"
    }
  ]
}

IMPORTANTE: Identifique TODAS as seções presentes na petição, não apenas as principais. Se houver subseções, crie seções separadas para cada uma.`;

    const response = await invokeLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Baixa temperatura para maior precisão
    });

    const conteudoResposta = response.choices[0]?.message?.content;
    
    if (typeof conteudoResposta !== 'string') {
      throw new Error('Resposta da IA em formato inválido');
    }

    // Extrair JSON da resposta (pode vir com markdown)
    let jsonStr = conteudoResposta.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }

    const analise: AnalisePeticao = JSON.parse(jsonStr);

    return analise;
  } catch (error: any) {
    console.error('Erro ao analisar estrutura da petição:', error);
    throw new Error(`Erro ao analisar petição: ${error.message}`);
  }
}

/**
 * Analisa uma petição em chunks para processos muito grandes
 * @param textoPeticao Texto completo da petição
 * @returns Análise completa
 */
export async function analisarPeticaoGrande(textoPeticao: string): Promise<AnalisePeticao> {
  const CHUNK_SIZE = 12000; // Tamanho de cada chunk
  
  // Se o texto for pequeno, analisa diretamente
  if (textoPeticao.length <= CHUNK_SIZE) {
    return await analisarEstruturaPeticao(textoPeticao);
  }

  // Dividir em chunks
  const chunks: string[] = [];
  for (let i = 0; i < textoPeticao.length; i += CHUNK_SIZE) {
    chunks.push(textoPeticao.substring(i, i + CHUNK_SIZE));
  }

  // Analisar primeiro chunk para estrutura geral
  const analiseInicial = await analisarEstruturaPeticao(chunks[0]);

  // Analisar chunks restantes e mesclar
  for (let i = 1; i < chunks.length; i++) {
    const analiseChunk = await analisarEstruturaPeticao(chunks[i]);
    
    // Mesclar seções
    analiseChunk.secoes.forEach(secao => {
      const secaoExistente = analiseInicial.secoes.find(s => s.tipo === secao.tipo && s.titulo === secao.titulo);
      if (secaoExistente) {
        secaoExistente.conteudo += '\n\n' + secao.conteudo;
      } else {
        secao.ordem = analiseInicial.secoes.length + 1;
        analiseInicial.secoes.push(secao);
      }
    });
  }

  return analiseInicial;
}

