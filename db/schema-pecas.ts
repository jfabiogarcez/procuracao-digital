import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const pecasProcessuais = pgTable("pecas_processuais", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  tipo: text("tipo").notNull(), // inicial, contestacao, recurso, peticao_intermediaria, etc
  conteudo: text("conteudo").notNull(),
  processoId: integer("processo_id"),
  clienteId: integer("cliente_id"),
  numeroProcesso: text("numero_processo"),
  status: text("status").default("rascunho"), // rascunho, finalizado, enviado
  versao: integer("versao").default(1),
  geradoPorIA: boolean("gerado_por_ia").default(false),
  promptIA: text("prompt_ia"),
  jurisprudencias: text("jurisprudencias"), // JSON com jurisprudências encontradas
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: integer("user_id").notNull(),
});

export const insertPecaSchema = createInsertSchema(pecasProcessuais);
export const selectPecaSchema = createSelectSchema(pecasProcessuais);
export type InsertPeca = typeof pecasProcessuais.$inferInsert;
export type SelectPeca = typeof pecasProcessuais.$inferSelect;

