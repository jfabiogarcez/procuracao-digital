import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const contratos = pgTable("contratos", {
  id: serial("id").primaryKey(),
  
  // Dados do Contratante (vem da procuração)
  contratanteNome: text("contratante_nome").notNull(),
  contratanteRg: text("contratante_rg"),
  contratanteCpf: text("contratante_cpf").notNull(),
  contratanteEndereco: text("contratante_endereco"),
  contratanteCidade: text("contratante_cidade"),
  contratanteEstado: text("contratante_estado"),
  contratanteCep: text("contratante_cep"),
  contratanteEmail: text("contratante_email"),
  contratanteTelefone: text("contratante_telefone"),
  
  // Dados do Contrato
  tipoAcao: text("tipo_acao").notNull(), // Ex: "Ação Trabalhista", "Divórcio", etc
  areaAtuacao: text("area_atuacao").notNull(), // Ex: "Direito Trabalhista", "Direito de Família"
  descricaoServico: text("descricao_servico").notNull(),
  
  // Honorários
  tipoHonorario: text("tipo_honorario").notNull(), // "fixo", "exito", "misto"
  valorFixo: integer("valor_fixo"), // em centavos
  percentualExito: integer("percentual_exito"), // percentual (ex: 30 = 30%)
  valorOabReferencia: integer("valor_oab_referencia"), // valor sugerido pela OAB
  
  // Datas e Prazos
  dataInicio: timestamp("data_inicio").notNull(),
  prazoVigencia: text("prazo_vigencia"), // "indeterminado" ou data específica
  
  // Assinatura
  assinadoEm: timestamp("assinado_em"),
  assinaturaBase64: text("assinatura_base64"),
  fotoAutenticacaoBase64: text("foto_autenticacao_base64"),
  ipAssinatura: text("ip_assinatura"),
  
  // QR Code e Verificação
  codigoVerificacao: text("codigo_verificacao").unique(),
  qrcodeBase64: text("qrcode_base64"),
  
  // PDF Gerado
  pdfUrl: text("pdf_url"),
  pdfGeradoEm: timestamp("pdf_gerado_em"),
  
  // Status
  status: text("status").notNull().default("rascunho"), // "rascunho", "aguardando_assinatura", "assinado", "cancelado"
  
  // Relacionamento com procuração (se houver)
  procuracaoId: integer("procuracao_id"),
  
  // Observações e Cláusulas Adicionais
  observacoes: text("observacoes"),
  clausulasAdicionais: jsonb("clausulas_adicionais"),
  
  // Metadados
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
  criadoPor: text("criado_por"), // user ID ou "sistema"
});

export const insertContratoSchema = createInsertSchema(contratos, {
  contratanteNome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  contratanteCpf: z.string().min(11, "CPF inválido"),
  contratanteEmail: z.string().email("Email inválido").optional(),
  tipoAcao: z.string().min(5, "Tipo de ação deve ser especificado"),
  areaAtuacao: z.string().min(5, "Área de atuação deve ser especificada"),
  descricaoServico: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  tipoHonorario: z.enum(["fixo", "exito", "misto"]),
  valorFixo: z.number().int().positive().optional(),
  percentualExito: z.number().int().min(1).max(100).optional(),
  dataInicio: z.date(),
});

export const selectContratoSchema = createSelectSchema(contratos);

export type Contrato = typeof contratos.$inferSelect;
export type InsertContrato = typeof contratos.$inferInsert;

