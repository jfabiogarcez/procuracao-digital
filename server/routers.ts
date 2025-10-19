import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

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
        const { generateProcuracaoPDF } = await import("./pdfGenerator");
        
        const procuracao = input.procuracaoData;
        if (!procuracao) {
          throw new Error("Dados da procuracao nao fornecidos");
        }
        
        const pdfBuffer = await generateProcuracaoPDF(procuracao);
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
});

export type AppRouter = typeof appRouter;
