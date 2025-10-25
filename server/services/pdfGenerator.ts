import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

interface DadosAdvogado {
  nome: string;
  oab: string;
  endereco: string;
  cidade: string;
  email: string;
  telefone: string;
}

interface DadosProcuracao {
  nomeCompleto: string;
  nacionalidade: string;
  estadoCivil: string;
  profissao: string;
  rg: string;
  cpf: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  email?: string;
  telefone?: string;
  assinatura: string;
  foto?: string;
  dataEmissao: string;
  qrCode: string;
}

interface DadosContrato {
  clienteNome: string;
  clienteCpf: string;
  clienteRg?: string;
  clienteEndereco?: string;
  clienteTelefone: string;
  clienteEmail: string;
  objetoContrato: string;
  descricaoServicos: string;
  valorHonorarios: string;
  formaPagemento: string;
  numeroParcelas?: string;
  dataVencimento?: string;
  prazoContrato?: string;
  dataInicio: string;
  dataTermino?: string;
  clausulasAdicionais?: string;
  assinaturaCliente: string;
  assinaturaAdvogado: string;
  dataAssinatura: string;
  qrCode: string;
}

const dadosAdvogado: DadosAdvogado = {
  nome: "Dr. José Fábio Garcez",
  oab: "OAB/SP 504.270",
  endereco: "Rua Exemplo, 123 - Centro",
  cidade: "São Paulo - SP",
  email: "documentos@jfg.adv.br",
  telefone: "(11) 1234-5678"
};

export async function gerarPDFProcuracao(dados: DadosProcuracao): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const qrCodeDataUrl = await QRCode.toDataURL(dados.qrCode);

      doc.fontSize(24).fillColor('#1a2847').text('JFG ADVOCACIA', { align: 'center' });
      doc.fontSize(10).fillColor('#666').text(dadosAdvogado.oab, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text(dadosAdvogado.endereco, { align: 'center' })
         .text(`${dadosAdvogado.cidade} | ${dadosAdvogado.telefone}`, { align: 'center' })
         .text(dadosAdvogado.email, { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(16).fillColor('#000').text('PROCURAÇÃO', { align: 'center', underline: true });
      doc.moveDown(1.5);
      doc.fontSize(11).fillColor('#000');

      const enderecoCompleto = `${dados.endereco}, ${dados.numero}${dados.complemento ? ', ' + dados.complemento : ''}, ${dados.bairro}, ${dados.cidade}/${dados.estado}, CEP ${dados.cep}`;
      
      doc.text('OUTORGANTE:', { continued: true }).font('Helvetica-Bold').text(` ${dados.nomeCompleto}`, { continued: false });
      doc.font('Helvetica').text(`nacionalidade ${dados.nacionalidade}, ${dados.estadoCivil}, ${dados.profissao}, portador(a) do RG nº ${dados.rg} e CPF nº ${dados.cpf}, residente e domiciliado(a) à ${enderecoCompleto}.`);
      doc.moveDown(1);
      doc.text('OUTORGADO:', { continued: true }).font('Helvetica-Bold').text(` ${dadosAdvogado.nome}`, { continued: false });
      doc.font('Helvetica').text(`inscrito na ${dadosAdvogado.oab}, com escritório à ${dadosAdvogado.endereco}, ${dadosAdvogado.cidade}.`);
      doc.moveDown(1);
      doc.font('Helvetica-Bold').text('PODERES:', { underline: true });
      doc.moveDown(0.5);
      doc.font('Helvetica').text('O OUTORGANTE confere ao OUTORGADO os mais amplos e gerais poderes para o foro em geral, com as cláusulas "ad judicia" e "extra judicia", podendo representá-lo perante quaisquer órgãos públicos, repartições, Juízos, Instâncias e Tribunais, para propor e acompanhar ações, contestar, reconvir, desistir, transigir, fazer acordos, receber e dar quitação, requerer, alegar, apresentar documentos, juntar procurações, substabelecer com ou sem reservas de poderes, podendo ainda praticar todos os atos necessários ao fiel cumprimento do presente mandato.');
      doc.moveDown(1.5);
      doc.fontSize(11).text(`${dados.cidade}, ${formatarData(dados.dataEmissao)}.`, { align: 'center' });
      doc.moveDown(2);

      const pageWidth = doc.page.width;
      const leftMargin = 50;
      const assinaturaY = doc.y + 100;
      
      if (dados.foto) {
        const fotoBuffer = Buffer.from(dados.foto.split(',')[1], 'base64');
        doc.image(fotoBuffer, leftMargin, doc.y, { width: 60, height: 60 });
        doc.fontSize(8).fillColor('#666').text('Foto de Autenticação', leftMargin, doc.y + 65, { width: 60, align: 'center' });
      }
      
      if (dados.assinatura) {
        const assinaturaBuffer = Buffer.from(dados.assinatura.split(',')[1], 'base64');
        doc.image(assinaturaBuffer, leftMargin, assinaturaY, { width: 150, height: 50 });
      }
      
      doc.moveTo(leftMargin, assinaturaY + 60).lineTo(leftMargin + 150, assinaturaY + 60).stroke();
      doc.fontSize(10).fillColor('#000').text(dados.nomeCompleto, leftMargin, assinaturaY + 65, { width: 150, align: 'center' });
      doc.fontSize(9).fillColor('#666').text('Outorgante', leftMargin, assinaturaY + 80, { width: 150, align: 'center' });

      const advogadoX = leftMargin + 200;
      doc.moveTo(advogadoX, assinaturaY + 60).lineTo(advogadoX + 150, assinaturaY + 60).stroke();
      doc.fontSize(10).fillColor('#000').text(dadosAdvogado.nome, advogadoX, assinaturaY + 65, { width: 150, align: 'center' });
      doc.fontSize(9).fillColor('#666').text(dadosAdvogado.oab, advogadoX, assinaturaY + 80, { width: 150, align: 'center' });

      const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
      const qrCodeSize = 80;
      const qrCodeX = (pageWidth - qrCodeSize) / 2;
      const qrCodeY = doc.page.height - 130;
      
      doc.image(qrCodeBuffer, qrCodeX, qrCodeY, { width: qrCodeSize, height: qrCodeSize });
      doc.fontSize(8).fillColor('#666').text(dados.qrCode, qrCodeX - 50, qrCodeY + qrCodeSize + 5, { width: qrCodeSize + 100, align: 'center' });
      doc.fontSize(8).fillColor('#999').text(`${dadosAdvogado.nome} | ${dadosAdvogado.oab} | ${dadosAdvogado.email}`, 50, doc.page.height - 30, { align: 'center', width: pageWidth - 100 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function gerarPDFContrato(dados: DadosContrato): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const qrCodeDataUrl = await QRCode.toDataURL(dados.qrCode);

      doc.fontSize(24).fillColor('#1a2847').text('JFG ADVOCACIA', { align: 'center' });
      doc.fontSize(10).fillColor('#666').text(dadosAdvogado.oab, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text(dadosAdvogado.endereco, { align: 'center' })
         .text(`${dadosAdvogado.cidade} | ${dadosAdvogado.telefone}`, { align: 'center' })
         .text(dadosAdvogado.email, { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(16).fillColor('#000').text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS', { align: 'center', underline: true });
      doc.moveDown(1.5);
      doc.fontSize(11);
      
      doc.font('Helvetica-Bold').text('CONTRATANTE: ', { continued: true })
         .font('Helvetica').text(`${dados.clienteNome}, CPF nº ${dados.clienteCpf}${dados.clienteRg ? ', RG nº ' + dados.clienteRg : ''}, ${dados.clienteEndereco || ''}, telefone ${dados.clienteTelefone}, email ${dados.clienteEmail}.`);
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('CONTRATADO: ', { continued: true })
         .font('Helvetica').text(`${dadosAdvogado.nome}, inscrito na ${dadosAdvogado.oab}, com escritório à ${dadosAdvogado.endereco}, ${dadosAdvogado.cidade}, email ${dadosAdvogado.email}.`);
      doc.moveDown(1);

      let clausulaNum = 1;
      doc.font('Helvetica-Bold').text(`CLÁUSULA ${clausulaNum++}ª - DO OBJETO`);
      doc.font('Helvetica').text(`O presente contrato tem por objeto ${dados.objetoContrato}.`);
      doc.moveDown(0.5);
      doc.text(dados.descricaoServicos);
      doc.moveDown(1);
      doc.font('Helvetica-Bold').text(`CLÁUSULA ${clausulaNum++}ª - DOS HONORÁRIOS`);
      doc.font('Helvetica').text(`O CONTRATANTE pagará ao CONTRATADO, a título de honorários advocatícios, o valor de ${dados.valorHonorarios}, na forma de pagamento ${dados.formaPagemento}.`);
      if (dados.numeroParcelas && parseInt(dados.numeroParcelas) > 1) {
        doc.text(`O valor será dividido em ${dados.numeroParcelas} parcelas${dados.dataVencimento ? ', com vencimento todo dia ' + dados.dataVencimento : ''}.`);
      }
      doc.moveDown(1);
      if (dados.prazoContrato) {
        doc.font('Helvetica-Bold').text(`CLÁUSULA ${clausulaNum++}ª - DO PRAZO`);
        doc.font('Helvetica').text(`O presente contrato terá vigência de ${dados.prazoContrato}, com início em ${formatarData(dados.dataInicio)}${dados.dataTermino ? ' e término em ' + formatarData(dados.dataTermino) : ''}.`);
        doc.moveDown(1);
      }
      if (dados.clausulasAdicionais) {
        doc.font('Helvetica-Bold').text(`CLÁUSULA ${clausulaNum++}ª - DISPOSIÇÕES ADICIONAIS`);
        doc.font('Helvetica').text(dados.clausulasAdicionais);
        doc.moveDown(1);
      }
      doc.font('Helvetica-Bold').text(`CLÁUSULA ${clausulaNum++}ª - DO FORO`);
      doc.font('Helvetica').text('As partes elegem o foro da Comarca de São Paulo/SP para dirimir quaisquer dúvidas oriundas do presente contrato.');
      doc.moveDown(1.5);
      doc.text(`São Paulo, ${formatarData(dados.dataAssinatura)}.`, { align: 'center' });
      doc.moveDown(2);

      const pageWidth = doc.page.width;
      const leftMargin = 50;
      const assinaturaY = doc.y;

      if (dados.assinaturaCliente) {
        const assinaturaBuffer = Buffer.from(dados.assinaturaCliente.split(',')[1], 'base64');
        doc.image(assinaturaBuffer, leftMargin, assinaturaY, { width: 150, height: 50 });
      }
      doc.moveTo(leftMargin, assinaturaY + 60).lineTo(leftMargin + 150, assinaturaY + 60).stroke();
      doc.fontSize(10).text(dados.clienteNome, leftMargin, assinaturaY + 65, { width: 150, align: 'center' });
      doc.fontSize(9).fillColor('#666').text('Contratante', leftMargin, assinaturaY + 80, { width: 150, align: 'center' });

      const advogadoX = leftMargin + 200;
      if (dados.assinaturaAdvogado) {
        const assinaturaBuffer = Buffer.from(dados.assinaturaAdvogado.split(',')[1], 'base64');
        doc.image(assinaturaBuffer, advogadoX, assinaturaY, { width: 150, height: 50 });
      }
      doc.moveTo(advogadoX, assinaturaY + 60).lineTo(advogadoX + 150, assinaturaY + 60).stroke();
      doc.fontSize(10).fillColor('#000').text(dadosAdvogado.nome, advogadoX, assinaturaY + 65, { width: 150, align: 'center' });
      doc.fontSize(9).fillColor('#666').text(dadosAdvogado.oab, advogadoX, assinaturaY + 80, { width: 150, align: 'center' });

      const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
      const qrCodeSize = 80;
      const qrCodeX = (pageWidth - qrCodeSize) / 2;
      const qrCodeY = doc.page.height - 130;
      doc.image(qrCodeBuffer, qrCodeX, qrCodeY, { width: qrCodeSize, height: qrCodeSize });
      doc.fontSize(8).fillColor('#666').text(dados.qrCode, qrCodeX - 50, qrCodeY + qrCodeSize + 5, { width: qrCodeSize + 100, align: 'center' });
      doc.fontSize(8).fillColor('#999').text(`${dadosAdvogado.nome} | ${dadosAdvogado.oab} | ${dadosAdvogado.email}`, 50, doc.page.height - 30, { align: 'center', width: pageWidth - 100 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function formatarData(dataISO: string): string {
  const data = new Date(dataISO);
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

