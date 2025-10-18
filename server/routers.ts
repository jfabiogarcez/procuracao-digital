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
        const { generateProcuracaoDocument } = await import("./documentGenerator");
        
        const procuracao = await getProcuracao(input.id);
        if (!procuracao) {
          throw new Error("Procura\u00e7\u00e3o n\u00e3o encontrada");
        }
        
        const docBuffer = await generateProcuracaoDocument(procuracao);
        const base64Doc = docBuffer.toString("base64");
        
        return {
          document: base64Doc,
          filename: `procuracao_${procuracao.nomeCompleto.replace(/\s+/g, "_")}_${input.id}.docx`,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
