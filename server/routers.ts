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
          email: z.string().email(),
          assinatura: z.string(),
          fotoAutenticacao: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createProcuracao } = await import("./db");
        const { nanoid } = await import("nanoid");
        const QRCode = (await import("qrcode")).default;
        
        const id = nanoid();
        const qrCodeData = await QRCode.toDataURL(id);
        
        const procuracao = await createProcuracao({
          id,
          ...input,
          qrCode: qrCodeData,
        });
        
        return procuracao;
      }),
    
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const { getProcuracao } = await import("./db");
        return await getProcuracao(input.id);
      }),
    
    generateDocument: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const { getProcuracao } = await import("./db");
        const { generateProcuracaoPDF } = await import("./pdfGenerator");
        const { storagePut } = await import("./storage");
        
        const procuracao = await getProcuracao(input.id);
        if (!procuracao) {
          throw new Error("Procuracao nao encontrada");
        }
        
        const pdfBuffer = await generateProcuracaoPDF(procuracao);
        const base64Pdf = pdfBuffer.toString("base64");
        
        // Upload para S3
        const filename = `procuracao_${procuracao.nomeCompleto.replace(/\s+/g, "_")}_${input.id}.pdf`;
        const { url: pdfUrl } = await storagePut(
          `procuracoes/${filename}`,
          pdfBuffer,
          "application/pdf"
        );
        
        // Gerar link do WhatsApp
        const whatsappNumber = "5511947219180"; // (11) 94721-9180
        const message = encodeURIComponent(
          `Procuracao Digital - ${procuracao.nomeCompleto}\n\nDocumento: ${pdfUrl}`
        );
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
        
        return {
          document: base64Pdf,
          filename,
          pdfUrl,
          whatsappLink,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
