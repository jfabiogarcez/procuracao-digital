import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { buscarJurisprudenciaJusbrasil } from "./services/jusbrasil";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  procuracao: router({
    create: publicProcedure
      .input(
        z.object({
          nomeCompleto: z.string(),
          nacionalidade: z.string(),
          estadoCivil: z.string(),
          profissao: z.string(),
          rg: z.string(),
          cpf: z.string(),
          endereco: z.string(),
          numero: z.string(),
          complemento: z.string().optional(),
          bairro: z.string(),
          cep: z.string(),
          cidade: z.string(),
          estado: z.string(),
          email: z.string().email("Email invalido. Por favor, insira um email valido."),
          assinatura: z.string(),
          fotoAutenticacao: z.string().optional(),
          // Testemunhas
          testemunha1Nome: z.string().optional(),
          testemunha1Cpf: z.string().optional(),
          testemunha1Rg: z.string().optional(),
          testemunha2Nome: z.string().optional(),
          testemunha2Cpf: z.string().optional(),
          testemunha2Rg: z.string().optional(),
          // Metadados de seguranca
          ipAddress: z.string().optional(),
          userAgent: z.string().optional(),
          geolocalizacao: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { nanoid } = await import("nanoid");
        const QRCode = (await import("qrcode")).default;
        
        const id = nanoid();
        const qrCodeData = await QRCode.toDataURL(id);
        
        // Retornar dados sem salvar no banco
        const procuracao = {
          id,
          ...input,
          qrCode: qrCodeData,
          dataEmissao: new Date(),
          createdAt: new Date(),
        };
        
        return procuracao;
      }),
    
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const { getProcuracao } = await import("./db");
        return await getProcuracao(input.id);
      }),
    
    generateDocument: publicProcedure
      .input(z.object({ 
        id: z.string(),
        procuracaoData: z.any(),
      }))
      .mutation(async ({ input }) => {
        const { gerarPDFProcuracao } = await import("./services/pdfGenerator");
        
        const procuracao = input.procuracaoData;
        if (!procuracao) {
          throw new Error("Dados da procuracao nao fornecidos");
        }
        
        const pdfBuffer = await gerarPDFProcuracao(procuracao);
        const base64Pdf = pdfBuffer.toString("base64");
        
        const filename = `procuracao_${procuracao.nomeCompleto.replace(/\s+/g, "_")}_${input.id}.pdf`;
        
        // Gerar link do WhatsApp (sem URL do PDF, apenas mensagem)
        const whatsappNumber = "5511947219180"; // (11) 94721-9180
        const message = encodeURIComponent(
          `Ol\u00e1! Segue em anexo a Procura\u00e7\u00e3o Digital de ${procuracao.nomeCompleto}.`
        );
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
        
        return {
          document: base64Pdf,
          filename,
          pdfUrl: "", // Sem upload, apenas download local
          whatsappLink,
        };
      }),
    
    sendEmail: publicProcedure
      .input(z.object({ 
        id: z.string(),
        pdfUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { getProcuracao } = await import("./db");
        const { sendProcuracaoEmail } = await import("./emailSender");
        
        const procuracao = await getProcuracao(input.id);
        if (!procuracao) {
          throw new Error("Procuracao nao encontrada");
        }
        
        const result = await sendProcuracaoEmail({
          pdfUrl: input.pdfUrl,
          nomeOutorgante: procuracao.nomeCompleto,
          emailDestino: "jose.fabio.garcez@gmail.com",
        });
        
        return result;
      }),
  }),

  // Rotas de peças processuais
  pecas: router({
    // Listar todas as peças
    listar: publicProcedure
      .input(
        z.object({
          tipo: z.string().optional(),
          status: z.string().optional(),
          busca: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { pecasProcessuais } = await import("../drizzle/schema");
        const { eq, and, or, like, desc } = await import("drizzle-orm");
        
        let query = db.select().from(pecasProcessuais);
        const conditions = [];
        
        if (input.tipo) {
          conditions.push(eq(pecasProcessuais.tipo, input.tipo as any));
        }
        
        if (input.status) {
          conditions.push(eq(pecasProcessuais.status, input.status as any));
        }
        
        if (input.busca) {
          conditions.push(
            or(
              like(pecasProcessuais.titulo, `%${input.busca}%`),
              like(pecasProcessuais.numeroProcesso, `%${input.busca}%`)
            )
          );
        }
        
        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }
        
        return await query.orderBy(desc(pecasProcessuais.updatedAt));
      }),
    
    // Obter peça por ID
    obter: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { pecasProcessuais } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const [peca] = await db
          .select()
          .from(pecasProcessuais)
          .where(eq(pecasProcessuais.id, input.id));
        
        return peca;
      }),
    
    // Criar nova peça
    criar: publicProcedure
      .input(
        z.object({
          titulo: z.string(),
          tipo: z.string(),
          conteudo: z.string(),
          processoId: z.string().optional(),
          clienteId: z.string().optional(),
          numeroProcesso: z.string().optional(),
          status: z.string().optional(),
          geradoPorIA: z.string().optional(),
          promptIA: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { nanoid } = await import("nanoid");
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { pecasProcessuais } = await import("../drizzle/schema");
        
        const id = nanoid();
        
        await db.insert(pecasProcessuais).values({
          id,
          titulo: input.titulo,
          tipo: input.tipo as any,
          conteudo: input.conteudo,
          processoId: input.processoId,
          clienteId: input.clienteId,
          numeroProcesso: input.numeroProcesso,
          status: (input.status as any) || 'rascunho',
          versao: '1',
          geradoPorIA: (input.geradoPorIA as any) || 'nao',
          promptIA: input.promptIA,
          createdBy: ctx.user?.id || 'sistema',
        });
        
        return { id, success: true };
      }),
    
    // Atualizar peça
    atualizar: publicProcedure
      .input(
        z.object({
          id: z.string(),
          titulo: z.string().optional(),
          conteudo: z.string().optional(),
          status: z.string().optional(),
          numeroProcesso: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { pecasProcessuais } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const updateData: any = { updatedAt: new Date() };
        if (input.titulo) updateData.titulo = input.titulo;
        if (input.conteudo) updateData.conteudo = input.conteudo;
        if (input.status) updateData.status = input.status;
        if (input.numeroProcesso) updateData.numeroProcesso = input.numeroProcesso;
        
        await db
          .update(pecasProcessuais)
          .set(updateData)
          .where(eq(pecasProcessuais.id, input.id));
        
        return { success: true };
      }),
    
    // Deletar peça
    deletar: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { pecasProcessuais } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db
          .delete(pecasProcessuais)
          .where(eq(pecasProcessuais.id, input.id));
        
        return { success: true };
      }),
    
    // Buscar jurisprudências no Jusbrasil
    buscarJurisprudencias: publicProcedure
      .input(
        z.object({
          termo: z.string().min(3, "Termo de busca muito curto"),
          limite: z.number().optional().default(5),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const jurisprudencias = await buscarJurisprudenciaJusbrasil(input.termo, input.limite);
          return { jurisprudencias };
        } catch (error: any) {
          throw new Error(`Erro ao buscar jurisprudências: ${error.message}`);
        }
      }),
    
    // Gerar peça com IA
    gerarComIA: publicProcedure
      .input(
        z.object({
          tipo: z.string(),
          contexto: z.string(),
          partesEnvolvidas: z.string().optional(),
          fundamentosJuridicos: z.string().optional(),
          pedidos: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        // Mapear tipos de peças para descrições
        const tiposDescricao: Record<string, string> = {
          peticao_inicial: "Petição Inicial",
          contestacao: "Contestação",
          recurso: "Recurso",
          peticao_intermediaria: "Petição Intermediária",
          memoriais: "Memoriais",
          agravo: "Agravo",
          apelacao: "Apelação",
          embargos: "Embargos de Declaração",
        };
        
        const tipoDescricao = tiposDescricao[input.tipo] || input.tipo;
        
        // Construir prompt para a IA
        const systemPrompt = `Você é um assistente jurídico especializado em elaboração de peças processuais brasileiras. 
Você deve gerar uma ${tipoDescricao} completa, bem fundamentada e seguindo as normas do CPC.
Use linguagem técnica apropriada e estruture o documento de forma profissional.`;
        
        const userPrompt = `Gere uma ${tipoDescricao} com base nas seguintes informações:

Contexto do caso:
${input.contexto}

${input.partesEnvolvidas ? `Partes envolvidas:
${input.partesEnvolvidas}

` : ''}${input.fundamentosJuridicos ? `Fundamentos jurídicos:
${input.fundamentosJuridicos}

` : ''}${input.pedidos ? `Pedidos:
${input.pedidos}

` : ''}Gere o documento completo, incluindo:
1. Cabeçalho com identificação das partes
2. Exposição dos fatos
3. Fundamentação jurídica
4. Pedidos
5. Encerramento

Formato: Use HTML simples para formatação (tags <p>, <strong>, <em>, <h1>, <h2>, <h3>, <ul>, <ol>, <li>).`;
        
        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          });
          
          const conteudo = response.choices[0]?.message?.content;
          
          if (typeof conteudo !== 'string') {
            throw new Error('Resposta da IA em formato inválido');
          }
          
          return {
            success: true,
            conteudo,
            prompt: userPrompt,
          };
        } catch (error: any) {
          console.error('Erro ao gerar peça com IA:', error);
          throw new Error(`Erro ao gerar peça: ${error.message}`);
        }
      }),

    // Upload e análise de petição inicial (PDF)
    uploadPeticao: publicProcedure
      .input(
        z.object({
          pdfBase64: z.string(),
          nomeArquivo: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { nanoid } = await import('nanoid');
        const { extractTextFromPDFBuffer } = await import('./services/pdfExtractor');
        const { analisarPeticaoGrande } = await import('./services/peticaoAnalyzer');
        const { writeFile } = await import('fs/promises');
        const { join } = await import('path');
        const { tmpdir } = await import('os');

        try {
          // Converter base64 para buffer
          const pdfBuffer = Buffer.from(input.pdfBase64, 'base64');

          // Salvar temporariamente
          const tempPath = join(tmpdir(), `peticao_${nanoid()}.pdf`);
          await writeFile(tempPath, pdfBuffer);

          // Extrair texto
          const { text, numPages } = await extractTextFromPDFBuffer(pdfBuffer);

          // Analisar estrutura
          const analise = await analisarPeticaoGrande(text);

          return {
            success: true,
            analise,
            numPages,
          textoExtraido: text.substring(0, 1000), // Primeiros 1000 caracteres
        };
      } catch (error: any) {
        console.error('Erro ao processar petição:', error);
        throw new Error(`Erro ao processar petição: ${error.message}`);
      }
    }),

    // Criar plano de contestação
    criarPlanoContestacao: publicProcedure
      .input(z.object({ analise: z.any() }))
      .mutation(async ({ input }) => {
        const { criarPlanoContestacao } = await import('./services/contestacaoGenerator');
        
        try {
          const plano = await criarPlanoContestacao(input.analise);
          return { success: true, plano };
        } catch (error: any) {
          throw new Error(`Erro ao criar plano: ${error.message}`);
        }
      }),

    // Gerar seção específica da contestação
    gerarSecaoContestacao: publicProcedure
      .input(
        z.object({
          secao: z.any(),
          analise: z.any(),
          secaoPeticao: z.any().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { gerarSecaoContestacao } = await import('./services/contestacaoGenerator');
        
        try {
          const secaoGerada = await gerarSecaoContestacao(
            input.secao,
            input.analise,
            input.secaoPeticao
          );
          return { success: true, secao: secaoGerada };
        } catch (error: any) {
          throw new Error(`Erro ao gerar seção: ${error.message}`);
        }
      }),

    // Montar contestação final
    montarContestacaoFinal: publicProcedure
      .input(
        z.object({
          secoes: z.array(z.any()),
          analise: z.any(),
        })
      )
      .mutation(async ({ input }) => {
        const { montarContestacaoFinal } = await import('./services/contestacaoGenerator');
        
        try {
          const contestacao = await montarContestacaoFinal(input.secoes, input.analise);
          return { success: true, contestacao };
        } catch (error: any) {
          throw new Error(`Erro ao montar contestação: ${error.message}`);
        }
      }),
  }),

  // Rotas do painel administrativo
  admin: router({
    // Procuração administrativa
    criarProcuracao: publicProcedure
      .input(
        z.object({
          nomeCompleto: z.string(),
          nacionalidade: z.string(),
          estadoCivil: z.string(),
          profissao: z.string(),
          rg: z.string(),
          cpf: z.string(),
          endereco: z.string(),
          numero: z.string(),
          complemento: z.string().optional(),
          bairro: z.string(),
          cep: z.string(),
          cidade: z.string(),
          estado: z.string(),
          email: z.string().email().optional(),
          telefone: z.string().optional(),
          assinatura: z.string(),
          foto: z.string().optional(),
          dataEmissao: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { nanoid } = await import("nanoid");
        const { gerarPDFProcuracao } = await import("./services/pdfGenerator");
        const { enviarProcuracaoPorEmail } = await import("./services/emailService");
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { documentos } = await import("../drizzle/schema");
        
        // Gerar ID único
        const id = nanoid();
        const numeroDocumento = `PROC-${new Date().getFullYear()}-${id.substring(0, 8).toUpperCase()}`;
        
        // Preparar dados para PDF
        const dadosPDF = {
          ...input,
          qrCode: numeroDocumento,
        };
        
        // Gerar PDF
        const pdfBuffer = await gerarPDFProcuracao(dadosPDF);
        
        // Salvar no banco de dados
        await db.insert(documentos).values({
          id,
          tipo: 'procuracao',
          numeroDocumento,
          status: 'ativo',
          dados: JSON.stringify(input),
          pdfUrl: '', // Será atualizado após upload S3
          createdBy: ctx.user?.id || 'sistema',
        });
        
        // Enviar por email
        await enviarProcuracaoPorEmail(pdfBuffer, numeroDocumento, input.nomeCompleto);
        
        return {
          id,
          numeroDocumento,
          pdfBase64: pdfBuffer.toString('base64'),
        };
      }),
    
    // Contrato de serviços
    criarContrato: publicProcedure
      .input(
        z.object({
          clienteNome: z.string(),
          clienteCpf: z.string(),
          clienteRg: z.string().optional(),
          clienteEndereco: z.string().optional(),
          clienteTelefone: z.string(),
          clienteEmail: z.string().email(),
          objetoContrato: z.string(),
          descricaoServicos: z.string(),
          valorHonorarios: z.string(),
          formaPagemento: z.string(),
          numeroParcelas: z.string().optional(),
          dataVencimento: z.string().optional(),
          prazoContrato: z.string().optional(),
          dataInicio: z.string(),
          dataTermino: z.string().optional(),
          clausulasAdicionais: z.string().optional(),
          assinaturaCliente: z.string(),
          assinaturaAdvogado: z.string(),
          dataAssinatura: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { nanoid } = await import("nanoid");
        const { gerarPDFContrato } = await import("./services/pdfGenerator");
        const { enviarContratoPorEmail } = await import("./services/emailService");
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { documentos } = await import("../drizzle/schema");
        
        // Gerar ID único
        const id = nanoid();
        const numeroDocumento = `CONT-${new Date().getFullYear()}-${id.substring(0, 8).toUpperCase()}`;
        
        // Preparar dados para PDF
        const dadosPDF = {
          ...input,
          qrCode: numeroDocumento,
        };
        
        // Gerar PDF
        const pdfBuffer = await gerarPDFContrato(dadosPDF);
        
        // Salvar no banco de dados
        await db.insert(documentos).values({
          id,
          tipo: 'contrato',
          numeroDocumento,
          status: 'ativo',
          dados: JSON.stringify(input),
          pdfUrl: '', // Será atualizado após upload S3
          createdBy: ctx.user?.id || 'sistema',
        });
        
        // Enviar por email
        await enviarContratoPorEmail(
          pdfBuffer, 
          numeroDocumento, 
          input.clienteNome,
          input.clienteEmail
        );
        
        return {
          id,
          numeroDocumento,
          pdfBase64: pdfBuffer.toString('base64'),
        };
      }),
    
    // Listar documentos
    listarDocumentos: publicProcedure
      .input(
        z.object({
          tipo: z.enum(['todos', 'procuracao', 'contrato']).optional(),
          status: z.enum(['todos', 'ativo', 'cancelado', 'arquivado']).optional(),
          busca: z.string().optional(),
          limite: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { documentos } = await import("../drizzle/schema");
        const { sql, eq, and, or, like, desc } = await import("drizzle-orm");
        
        let query = db.select().from(documentos);
        
        const conditions = [];
        
        if (input.tipo && input.tipo !== 'todos') {
          conditions.push(eq(documentos.tipo, input.tipo));
        }
        
        if (input.status && input.status !== 'todos') {
          conditions.push(eq(documentos.status, input.status));
        }
        
        if (input.busca) {
          conditions.push(
            or(
              like(documentos.numeroDocumento, `%${input.busca}%`),
              sql`${documentos.dados}::text LIKE ${`%${input.busca}%`}`
            )
          );
        }
        
        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }
        
        const results = await query
          .orderBy(desc(documentos.createdAt))
          .limit(input.limite)
          .offset(input.offset);
        
        return results;
      }),
    
    // Obter documento por ID
    obterDocumento: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { documentos } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const [documento] = await db
          .select()
          .from(documentos)
          .where(eq(documentos.id, input.id));
        
        return documento;
      }),
    
    // Atualizar status do documento
    atualizarStatus: publicProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.enum(['ativo', 'cancelado', 'arquivado']),
        })
      )
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const { documentos } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db
          .update(documentos)
          .set({ status: input.status, updatedAt: new Date() })
          .where(eq(documentos.id, input.id));
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
