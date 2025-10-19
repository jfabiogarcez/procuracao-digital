import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Procuracao } from "../drizzle/schema";
import * as fs from "fs";
import * as path from "path";

export async function generateProcuracaoPDF(procuracao: Procuracao): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let yPosition = height - 50;
  const margin = 50;
  const lineHeight = 15;

  // Função auxiliar para adicionar texto
  const addText = (text: string, size: number, isBold: boolean = false, align: "left" | "center" = "left") => {
    const textFont = isBold ? boldFont : font;
    const textWidth = textFont.widthOfTextAtSize(text, size);
    const x = align === "center" ? (width - textWidth) / 2 : margin;
    
    page.drawText(text, {
      x,
      y: yPosition,
      size,
      font: textFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight;
  };

  // Função para adicionar parágrafo com quebra de linha
  const addParagraph = (text: string, size: number, isBold: boolean = false) => {
    const maxWidth = width - 2 * margin;
    const words = text.split(" ");
    let line = "";
    
    for (const word of words) {
      const testLine = line + (line ? " " : "") + word;
      const textWidth = (isBold ? boldFont : font).widthOfTextAtSize(testLine, size);
      
      if (textWidth > maxWidth && line) {
        addText(line, size, isBold);
        line = word;
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      addText(line, size, isBold);
    }
  };

  // Logo removido conforme solicitação do usuário

  // Cabeçalho
  addText("PROCURAÇÃO", 14, true, "center");
  yPosition -= 20;

  // Dados do Outorgante
  const enderecoCompleto = `${procuracao.endereco}, n ${procuracao.numero}${procuracao.complemento ? ", " + procuracao.complemento : ""}, Bairro ${procuracao.bairro}, CEP ${procuracao.cep}, ${procuracao.cidade}/${procuracao.estado}`;
  
  addParagraph(
    `${procuracao.nomeCompleto.toUpperCase()}, ${procuracao.nacionalidade}, ${procuracao.estadoCivil}, portador da cedula de identidade RG n ${procuracao.rg}, inscrito no CPF/MF sob o n ${procuracao.cpf}, residente e domiciliado a ${enderecoCompleto}, com endereco eletronico: ${procuracao.email}.`,
    10
  );
  yPosition -= 10;

  // Outorgado
  addText("OUTORGADO:", 10, true);
  addParagraph(
    "Pelo presente instrumento particular de mandato, o outorgante nomeia e constitui como seu procurador o advogado:",
    10
  );
  yPosition -= 5;
  
  addParagraph(
    "Dr. JOSÉ FÁBIO GARCEZ, brasileiro, casado, inscrito na Ordem dos Advogados do Brasil, Seccional de São Paulo (OAB/SP) sob o n 504.270, com escritório profissional situado a Rua Capitão Antonio Rosa, n 409, 1 Andar, Edifício Spaces, Jardim Paulistano, São Paulo/SP, CEP 01443-010, endereço eletrônico: jose.fabio.garcez@gmail.com, telefone: (11) 94721-9180.",
    10
  );
  yPosition -= 10;

  // Poderes
  addParagraph(
    "Ao qual confere, com a mais ampla, geral e ilimitada quitação, poderes para atuar em seu nome, nos termos das cláusulas 'ad judicia' e 'ad negotia', conforme segue:",
    10
  );
  yPosition -= 5;

  addParagraph(
    "Cláusula 'ad judicia': Poderes amplos para representar o outorgante em juízo, com capacidade de propor ações, apresentar defesas, interpor recursos e acompanhar as demandas judiciais até sua solução final, seja qual for a instância ou tribunal;",
    10
  );
  yPosition -= 5;

  addParagraph(
    "Cláusula 'ad negotia': Poderes para atuar em questões extrajudiciais, representando o outorgante perante órgãos da Administração Pública, sejam eles da esfera Federal, Estadual ou Municipal, bem como perante entidades de classe, sindicatos, associações e instituições particulares;",
    10
  );
  yPosition -= 5;

  addParagraph(
    "Poderes especiais: Confere-se ao procurador poderes para confessar, desistir, transigir, firmar acordos, dar e receber quitação, requerer justiça gratuita, substabelecer com ou sem reservas de iguais poderes e praticar todos os atos necessários ao pleno exercício do mandato, observadas as disposições legais aplicáveis.",
    10
  );
  yPosition -= 10;

  // Fundamentação Legal
  addParagraph(
    "Este mandato é outorgado com fundamento nos arts. 105 e 106 do Código de Processo Civil (Lei 13.105/2015), na Constituição Federal de 1988 e na legislação correlata, sendo dado por bom, firme e valioso, desde sua assinatura.",
    10
  );
  yPosition -= 10;

  // Data
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
  
  addText(`São Paulo, ${dataFormatada}.`, 10);
  yPosition -= 30;

  // Foto de Autenticacao (se houver)
  if (procuracao.fotoAutenticacao) {
    try {
      const fotoBuffer = Buffer.from(procuracao.fotoAutenticacao.split(",")[1], "base64");
      const fotoImage = await pdfDoc.embedPng(fotoBuffer);
      const fotoDims = fotoImage.scale(0.2);
      
      page.drawImage(fotoImage, {
        x: margin,
        y: yPosition - fotoDims.height,
        width: fotoDims.width,
        height: fotoDims.height,
      });
      
      yPosition -= fotoDims.height + 20;
    } catch (error) {
      console.log("Erro ao adicionar foto");
    }
  }

  // Assinatura
  if (procuracao.assinatura) {
    try {
      const assinaturaBuffer = Buffer.from(procuracao.assinatura.split(",")[1], "base64");
      const assinaturaImage = await pdfDoc.embedPng(assinaturaBuffer);
      const assinaturaDims = assinaturaImage.scale(1.0);
      
      page.drawImage(assinaturaImage, {
        x: (width - (assinaturaDims.width * 0.7)) / 2,
        y: yPosition - (assinaturaDims.height * 0.7),
        width: assinaturaDims.width * 0.7,
        height: assinaturaDims.height * 0.7,
      });
      
      yPosition -= (assinaturaDims.height * 0.7) + 5;
    } catch (error) {
      console.log("Erro ao adicionar assinatura");
    }
  }

  // Linha para assinatura manuscrita e nome
  yPosition -= 10;
  
  // Linha horizontal para assinatura
  const lineWidth = 200;
  const lineX = (width - lineWidth) / 2;
  page.drawLine({
    start: { x: lineX, y: yPosition },
    end: { x: lineX + lineWidth, y: yPosition },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 15;
  addText(procuracao.nomeCompleto.toUpperCase(), 11, false, "center");
  yPosition -= 30;

  // Testemunhas (se fornecidas)
  if (procuracao.testemunha1Nome || procuracao.testemunha2Nome) {
    yPosition -= 10;
    addText("TESTEMUNHAS:", 10, true);
    yPosition -= 5;
    
    if (procuracao.testemunha1Nome) {
      // Linha para assinatura da testemunha 1
      const testLineWidth = 150;
      const testLine1X = margin;
      page.drawLine({
        start: { x: testLine1X, y: yPosition },
        end: { x: testLine1X + testLineWidth, y: yPosition },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      yPosition -= 12;
      addText(procuracao.testemunha1Nome, 9, false);
      if (procuracao.testemunha1Cpf) {
        addText("CPF: " + procuracao.testemunha1Cpf, 8, false);
      }
      if (procuracao.testemunha1Rg) {
        addText("RG: " + procuracao.testemunha1Rg, 8, false);
      }
      yPosition -= 10;
    }
    
    if (procuracao.testemunha2Nome) {
      // Linha para assinatura da testemunha 2
      const testLineWidth = 150;
      const testLine2X = margin;
      page.drawLine({
        start: { x: testLine2X, y: yPosition },
        end: { x: testLine2X + testLineWidth, y: yPosition },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      yPosition -= 12;
      addText(procuracao.testemunha2Nome, 9, false);
      if (procuracao.testemunha2Cpf) {
        addText("CPF: " + procuracao.testemunha2Cpf, 8, false);
      }
      if (procuracao.testemunha2Rg) {
        addText("RG: " + procuracao.testemunha2Rg, 8, false);
      }
      yPosition -= 10;
    }
  }

  // Aviso legal removido conforme solicitação do usuário

  // Rodapé
  yPosition = 50;
  addText("Rua Capitão Antonio Rosa, 409, 1 Andar, Edifício Spaces, Jardim Paulistano, São Paulo/SP, CEP 01443-010", 8, false, "center");
  addText("WhatsApp: (11) 9 4721-9180 / Tel. (11) 94721-9180", 8, false, "center");
  addText("E-mail: contato@jfg.adv.br", 8, false, "center");

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

