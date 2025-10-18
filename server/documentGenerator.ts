import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Footer,
  Header,
  convertInchesToTwip,
} from "docx";
import { Procuracao } from "../drizzle/schema";
import * as fs from "fs";
import * as path from "path";

export async function generateProcuracaoDocument(procuracao: Procuracao): Promise<Buffer> {
  // Converter base64 para buffer
  const assinaturaBuffer = Buffer.from(procuracao.assinatura.split(",")[1], "base64");
  const qrCodeBuffer = procuracao.qrCode ? Buffer.from(procuracao.qrCode.split(",")[1], "base64") : null;
  const fotoBuffer = procuracao.fotoAutenticacao
    ? Buffer.from(procuracao.fotoAutenticacao.split(",")[1], "base64")
    : null;

  // Formatar data
  const dataFormatada = procuracao.dataEmissao
    ? new Date(procuracao.dataEmissao).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: fs.readFileSync(path.join(__dirname, "../client/public/logo-jfg.png")),
                    transformation: {
                      width: 150,
                      height: 150,
                    },
                    type: "png",
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "JFG ADVOCACIA",
                    bold: true,
                    size: 28,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Rua Capitão Antônio Rosa, 409, 1º Andar, Edifício Spaces, Jardim Paulistano, São Paulo/SP, CEP 01443-010",
                    size: 18,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "WhatsApp: (11) 9 4721-9180 / Tel. (11) 94721-9180",
                    size: 18,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "E-mail: jose.fabio.garcez@gmail.com",
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Título
          new Paragraph({
            text: "PROCURAÇÃO",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Dados do Outorgante
          new Paragraph({
            children: [
              new TextRun({
                text: procuracao.nomeCompleto.toUpperCase(),
                bold: true,
              }),
              new TextRun({
                text: `, ${procuracao.nacionalidade}, ${procuracao.estadoCivil}, portador da cédula de identidade RG nº ${procuracao.rg}, inscrito no CPF/MF sob o nº ${procuracao.cpf}, residente e domiciliado à ${procuracao.endereco}, nº ${procuracao.numero}`,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `${procuracao.complemento ? ", " + procuracao.complemento : ""}, Bairro ${procuracao.bairro}, CEP ${procuracao.cep}, ${procuracao.cidade}/${procuracao.estado}, com endereço eletrônico: ${procuracao.email}.`,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Outorgado
          new Paragraph({
            children: [
              new TextRun({
                text: "OUTORGADO:",
                bold: true,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "Pelo presente instrumento particular de mandato, o outorgante nomeia e constitui como seu procurador o advogado:",
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Dr. JOSÉ FÁBIO GARCEZ",
                bold: true,
              }),
              new TextRun({
                text: ", brasileiro, casado, inscrito na Ordem dos Advogados do Brasil, Seccional de São Paulo (OAB/SP) sob o nº 504.270, com escritório profissional situado à Rua Capitão Antônio Rosa, nº 409, 1º Andar, Edifício Spaces, Jardim Paulistano, São Paulo/SP, CEP 01443-010, endereço eletrônico: jose.fabio.garcez@gmail.com, telefone: (11) 94721-9180.",
              }),
            ],
            spacing: { after: 400 },
          }),

          // Poderes
          new Paragraph({
            text: "Ao qual confere, com a mais ampla, geral e ilimitada quitação, poderes para atuar em seu nome, nos termos das cláusulas 'ad judicia' e 'ad negotia', conforme segue:",
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Cláusula 'ad judicia': ",
                bold: true,
              }),
              new TextRun({
                text: "Poderes amplos para representar o outorgante em juízo, com capacidade de propor ações, apresentar defesas, interpor recursos e acompanhar as demandas judiciais até sua solução final, seja qual for a instância ou tribunal;",
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Cláusula 'ad negotia': ",
                bold: true,
              }),
              new TextRun({
                text: "Poderes para atuar em questões extrajudiciais, representando o outorgante perante órgãos da Administração Pública, sejam eles da esfera Federal, Estadual ou Municipal, bem como perante entidades de classe, sindicatos, associações e instituições particulares;",
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Poderes especiais: ",
                bold: true,
              }),
              new TextRun({
                text: "Confere-se ao procurador poderes para confessar, desistir, transigir, firmar acordos, dar e receber quitação, requerer justiça gratuita, substabelecer com ou sem reservas de iguais poderes e praticar todos os atos necessários ao pleno exercício do mandato, observadas as disposições legais aplicáveis.",
              }),
            ],
            spacing: { after: 400 },
          }),

          // Fundamentação Legal
          new Paragraph({
            text: "Este mandato é outorgado com fundamento nos arts. 105 e 106 do Código de Processo Civil (Lei 13.105/2015), na Constituição Federal de 1988 e na legislação correlata, sendo dado por bom, firme e valioso, desde sua assinatura.",
            spacing: { after: 400 },
          }),

          // Data
          new Paragraph({
            text: `São Paulo, ${dataFormatada}.`,
            spacing: { after: 400 },
          }),

          // QR Code e Foto (lado a lado)
          ...(qrCodeBuffer || fotoBuffer
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    ...(qrCodeBuffer
                      ? [
                          new ImageRun({
                            data: qrCodeBuffer,
                            transformation: {
                              width: 100,
                              height: 100,
                            },
                            type: "png",
                          }),
                        ]
                      : []),
                    ...(fotoBuffer
                      ? [
                          new TextRun({ text: "  " }),
                          new ImageRun({
                            data: fotoBuffer,
                            transformation: {
                              width: 100,
                              height: 100,
                            },
                            type: "png",
                          }),
                        ]
                      : []),
                  ],
                  spacing: { after: 200 },
                }),
              ]
            : []),

          // Assinatura
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: assinaturaBuffer,
                transformation: {
                  width: 300,
                  height: 100,
                },
                type: "png",
              }),
            ],
            spacing: { after: 100 },
          }),

          // Nome e CPF
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: procuracao.nomeCompleto.toUpperCase(),
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `CPF: ${procuracao.cpf}`,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

