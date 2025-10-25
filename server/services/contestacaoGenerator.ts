import { invokeLLM } from '../_core/llm';
import { buscarJurisprudenciaJusbrasil } from './jusbrasil';
import type { AnalisePeticao, SecaoPeticao } from './peticaoAnalyzer';

export interface SecaoContestacao {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: string;
  ordem: number;
  status: 'pendente' | 'gerando' | 'gerado' | 'aprovado' | 'rejeitado';
  jurisprudencias?: any[];
}

export interface PlanoContestacao {
  secoes: SecaoContestacao[];
  resumoEstrategia: string;
}

/**
 * Cria um plano de contestação baseado na análise da petição
 * Gerenciado por Manus AI - decisão inteligente de quantas partes gerar
 */
export async function criarPlanoContestacao(analise: AnalisePeticao): Promise<PlanoContestacao> {
  const systemPrompt = `Você é Manus, um assistente jurídico especializado em estratégia processual.
Sua tarefa é criar um plano de contestação inteligente e adaptativo baseado na análise de uma petição inicial.

IMPORTANTE:
- Não há limite de seções - crie quantas forem necessárias
- Adapte-se à complexidade do caso
- Identifique pontos fracos na argumentação do autor
- Sugira estratégias de defesa eficazes`;

  const userPrompt = `Com base na seguinte análise de petição inicial, crie um plano de contestação:

**Resumo do caso:**
${analise.resumo}

**Partes:**
- Autor: ${analise.partes.autor || 'Não identificado'}
- Réu: ${analise.partes.reu || 'Não identificado'}

**Seções da petição inicial:**
${analise.secoes.map((s, i) => `${i + 1}. ${s.titulo} (${s.tipo}): ${s.conteudo.substring(0, 200)}...`).join('\n')}

Crie um plano de contestação em JSON com o seguinte formato:
{
  "resumoEstrategia": "Breve descrição da estratégia de defesa (2-3 frases)",
  "secoes": [
    {
      "id": "secao_1",
      "titulo": "Qualificação das Partes",
      "tipo": "qualificacao",
      "ordem": 1,
      "status": "pendente",
      "conteudo": "Breve descrição do que será gerado nesta seção"
    },
    {
      "id": "secao_2",
      "titulo": "Preliminares - Incompetência do Juízo",
      "tipo": "preliminar",
      "ordem": 2,
      "status": "pendente",
      "conteudo": "Descrição da preliminar"
    }
  ]
}

IMPORTANTE: Crie TODAS as seções necessárias, incluindo:
- Qualificação
- Preliminares (se aplicável)
- Impugnação aos fatos (pode ser dividida em múltiplas seções)
- Fundamentação jurídica (pode ser dividida por tema)
- Provas a produzir
- Pedidos`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
    });

    const conteudo = response.choices[0]?.message?.content;
    
    if (typeof conteudo !== 'string') {
      throw new Error('Resposta da IA em formato inválido');
    }

    // Extrair JSON
    let jsonStr = conteudo.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }

    const plano: PlanoContestacao = JSON.parse(jsonStr);

    return plano;
  } catch (error: any) {
    console.error('Erro ao criar plano de contestação:', error);
    throw new Error(`Erro ao criar plano: ${error.message}`);
  }
}

/**
 * Gera uma seção específica da contestação
 * Gerenciado por Manus AI com busca de jurisprudências
 */
export async function gerarSecaoContestacao(
  secao: SecaoContestacao,
  analise: AnalisePeticao,
  secaoPeticao?: SecaoPeticao
): Promise<SecaoContestacao> {
  try {
    // Buscar jurisprudências se for seção de direito
    let jurisprudencias: any[] = [];
    if (secao.tipo === 'direito' || secao.tipo === 'preliminar') {
      try {
        const termo = secaoPeticao?.conteudo.substring(0, 100) || secao.titulo;
        jurisprudencias = await buscarJurisprudenciaJusbrasil(termo, 3);
      } catch (error) {
        console.warn('Erro ao buscar jurisprudências, continuando sem elas');
      }
    }

    // Gerar conteúdo da seção
    const systemPrompt = `Você é Manus, um assistente jurídico especializado em elaboração de contestações.
Gere o conteúdo completo e profissional para a seção "${secao.titulo}" da contestação.

Use linguagem técnica apropriada, fundamentação sólida e estrutura clara.
Formato: HTML simples (tags <p>, <strong>, <em>, <h3>, <ul>, <li>).`;

    let userPrompt = `Gere o conteúdo completo para a seção "${secao.titulo}" da contestação.

**Contexto do caso:**
${analise.resumo}

**Partes:**
- Autor: ${analise.partes.autor}
- Réu: ${analise.partes.reu}

**Tipo de seção:** ${secao.tipo}
**Objetivo:** ${secao.conteudo}`;

    if (secaoPeticao) {
      userPrompt += `\n\n**Conteúdo da petição inicial a ser contestado:**\n${secaoPeticao.conteudo.substring(0, 2000)}`;
    }

    if (jurisprudencias.length > 0) {
      userPrompt += `\n\n**Jurisprudências para fundamentar:**\n`;
      jurisprudencias.forEach((j, i) => {
        userPrompt += `\n${i + 1}. ${j.tribunal} - ${j.numero}\n${j.ementa}\n`;
      });
    }

    userPrompt += `\n\nGere o texto completo e bem fundamentado para esta seção.`;

    const response = await invokeLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
    });

    const conteudoGerado = response.choices[0]?.message?.content;
    
    if (typeof conteudoGerado !== 'string') {
      throw new Error('Resposta da IA em formato inválido');
    }

    return {
      ...secao,
      conteudo: conteudoGerado,
      status: 'gerado',
      jurisprudencias,
    };
  } catch (error: any) {
    console.error(`Erro ao gerar seção ${secao.id}:`, error);
    throw new Error(`Erro ao gerar seção: ${error.message}`);
  }
}

/**
 * Monta a contestação final a partir das seções aprovadas
 */
export async function montarContestacaoFinal(secoes: SecaoContestacao[], analise: AnalisePeticao): Promise<string> {
  const secoesOrdenadas = secoes
    .filter(s => s.status === 'aprovado')
    .sort((a, b) => a.ordem - b.ordem);

  const systemPrompt = `Você é Manus, um assistente jurídico especializado.
Monte a contestação final completa e profissional, integrando todas as seções aprovadas.

Adicione:
- Cabeçalho formal
- Transições entre seções
- Encerramento adequado
- Formatação HTML profissional`;

  const userPrompt = `Monte a contestação final com as seguintes seções:

${secoesOrdenadas.map((s, i) => `## ${i + 1}. ${s.titulo}\n${s.conteudo}\n`).join('\n---\n\n')}

**Informações do processo:**
- Tribunal: ${analise.tribunal || 'A definir'}
- Vara: ${analise.vara || 'A definir'}
- Número: ${analise.numeroProcesso || 'A definir'}
- Autor: ${analise.partes.autor}
- Réu: ${analise.partes.reu}

Gere o documento completo e formatado em HTML.`;

  const response = await invokeLLM({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
  });

  const contestacaoFinal = response.choices[0]?.message?.content;
  
  if (typeof contestacaoFinal !== 'string') {
    throw new Error('Resposta da IA em formato inválido');
  }

  return contestacaoFinal;
}

