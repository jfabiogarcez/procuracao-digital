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

  // Logo (se existir)
  try {
    const logoPath = path.join(__dirname, "../client/public/logo-jfg.png");
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.15);
      
      page.drawImage(logoImage, {
        x: (width - logoDims.width) / 2,
        y: yPosition - logoDims.height,
        width: logoDims.width,
        height: logoDims.height,
      });
      
      yPosition -= logoDims.height + 10;
    }
  } catch (error) {
    console.log("Logo não encontrado, continuando sem logo");
  }

  // Cabeçalho
  addText("JFG ADVOCACIA", 16, true, "center");
  yPosition -= 10;
  addText("PROCURACAO", 14, true, "center");
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
    "Dr. JOSE FABIO GARCEZ, brasileiro, casado, inscrito na Ordem dos Advogados do Brasil, Seccional de Sao Paulo (OAB/SP) sob o n 504.270, com escritorio profissional situado a Rua Capitao Antonio Rosa, n 409, 1 Andar, Edificio Spaces, Jardim Paulistano, Sao Paulo/SP, CEP 01443-010, endereco eletronico: jose.fabio.garcez@gmail.com, telefone: (11) 94721-9180.",
    10
  );
  yPosition -= 10;

  // Poderes
  addParagraph(
    "Ao qual confere, com a mais ampla, geral e ilimitada quitacao, poderes para atuar em seu nome, nos termos das clausulas 'ad judicia' e 'ad negotia', conforme segue:",
    10
  );
  yPosition -= 5;

  addParagraph(
    "Clausula 'ad judicia': Poderes amplos para representar o outorgante em juizo, com capacidade de propor acoes, apresentar defesas, interpor recursos e acompanhar as demandas judiciais ate sua solucao final, seja qual for a instancia ou tribunal;",
    10
  );
  yPosition -= 5;

  addParagraph(
    "Clausula 'ad negotia': Poderes para atuar em questoes extrajudiciais, representando o outorgante perante orgaos da Administracao Publica, sejam eles da esfera Federal, Estadual ou Municipal, bem como perante entidades de classe, sindicatos, associacoes e instituicoes particulares;",
    10
  );
  yPosition -= 5;

  addParagraph(
    "Poderes especiais: Confere-se ao procurador poderes para confessar, desistir, transigir, firmar acordos, dar e receber quitacao, requerer justica gratuita, substabelecer com ou sem reservas de iguais poderes e praticar todos os atos necessarios ao pleno exercicio do mandato, observadas as disposicoes legais aplicaveis.",
    10
  );
  yPosition -= 10;

  // Fundamentação Legal
  addParagraph(
    "Este mandato e outorgado com fundamento nos arts. 105 e 106 do Codigo de Processo Civil (Lei 13.105/2015), na Constituicao Federal de 1988 e na legislacao correlata, sendo dado por bom, firme e valioso, desde sua assinatura.",
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
  
  addText(`Sao Paulo, ${dataFormatada}.`, 10);
  yPosition -= 20;

  // QR Code e Foto
  if (procuracao.qrCode) {
    try {
      const qrBuffer = Buffer.from(procuracao.qrCode.split(",")[1], "base64");
      const qrImage = await pdfDoc.embedPng(qrBuffer);
      const qrDims = qrImage.scale(0.3);
      
      page.drawImage(qrImage, {
        x: margin,
        y: yPosition - qrDims.height,
        width: qrDims.width,
        height: qrDims.height,
      });
    } catch (error) {
      console.log("Erro ao adicionar QR Code");
    }
  }

  if (procuracao.fotoAutenticacao) {
    try {
      const fotoBuffer = Buffer.from(procuracao.fotoAutenticacao.split(",")[1], "base64");
      const fotoImage = await pdfDoc.embedPng(fotoBuffer);
      const fotoDims = fotoImage.scale(0.15);
      
      page.drawImage(fotoImage, {
        x: margin + 120,
        y: yPosition - fotoDims.height,
        width: fotoDims.width,
        height: fotoDims.height,
      });
    } catch (error) {
      console.log("Erro ao adicionar foto");
    }
  }

  yPosition -= 120;

  // Assinatura
  if (procuracao.assinatura) {
    try {
      const assinaturaBuffer = Buffer.from(procuracao.assinatura.split(",")[1], "base64");
      const assinaturaImage = await pdfDoc.embedPng(assinaturaBuffer);
      const assinaturaDims = assinaturaImage.scale(0.5);
      
      page.drawImage(assinaturaImage, {
        x: (width - assinaturaDims.width) / 2,
        y: yPosition - assinaturaDims.height,
        width: assinaturaDims.width,
        height: assinaturaDims.height,
      });
      
      yPosition -= assinaturaDims.height + 10;
    } catch (error) {
      console.log("Erro ao adicionar assinatura");
    }
  }

  // Nome e CPF
  addText(procuracao.nomeCompleto.toUpperCase(), 10, true, "center");
  addText(`CPF: ${procuracao.cpf}`, 10, false, "center");
  yPosition -= 20;

  // Rodapé
  yPosition = 50;
  addText("Rua Capitao Antonio Rosa, 409, 1 Andar, Edificio Spaces, Jardim Paulistano, Sao Paulo/SP, CEP 01443-010", 8, false, "center");
  addText("WhatsApp: (11) 9 4721-9180 / Tel. (11) 94721-9180", 8, false, "center");
  addText("E-mail: jose.fabio.garcez@gmail.com", 8, false, "center");

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

