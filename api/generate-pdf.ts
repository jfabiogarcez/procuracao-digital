import type { VercelRequest, VercelResponse } from '@vercel/node';
import PDFDocument from 'pdfkit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const procuracaoData = req.body;

    // Criar PDF
    const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
    
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    
    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    // Cabeçalho
    doc.fontSize(16).font('Helvetica-Bold').text('PROCURAÇÃO', { align: 'center' });
    doc.moveDown(2);

    // Outorgante
    doc.fontSize(12).font('Helvetica-Bold').text('OUTORGANTE:', { continued: false });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Nome: ${procuracaoData.nomeCompleto}`);
    doc.text(`Nacionalidade: ${procuracaoData.nacionalidade}`);
    doc.text(`Estado Civil: ${procuracaoData.estadoCivil}`);
    doc.text(`Profissão: ${procuracaoData.profissao}`);
    doc.text(`RG: ${procuracaoData.rg}`);
    doc.text(`CPF: ${procuracaoData.cpf}`);
    doc.text(`E-mail: ${procuracaoData.email}`);
    doc.text(`Endereço: ${procuracaoData.logradouro}, ${procuracaoData.numero}${procuracaoData.complemento ? ', ' + procuracaoData.complemento : ''}, ${procuracaoData.bairro}, ${procuracaoData.cidade}/${procuracaoData.estado}, CEP ${procuracaoData.cep}`);
    doc.moveDown(1.5);

    // Outorgado
    doc.fontSize(12).font('Helvetica-Bold').text('OUTORGADO:', { continued: false });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Nome: Dr. Jose Fabio Garcez`);
    doc.text(`OAB/SP: 504.270`);
    doc.text(`Endereço: Rua Capitao Antonio Rosa, n 409, 1 Andar, Edificio Spaces, Jardim Paulistano, Sao Paulo/SP, CEP 01443-010`);
    doc.text(`E-mail: jose.fabio.garcez@gmail.com`);
    doc.text(`Telefone: (11) 94721-9180`);
    doc.moveDown(1.5);

    // Poderes
    doc.fontSize(12).font('Helvetica-Bold').text('PODERES:', { continued: false });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(
      'Pelo presente instrumento particular de procuração, o(a) OUTORGANTE acima qualificado(a) nomeia e constitui seu bastante procurador o(a) OUTORGADO(A) acima identificado(a), a quem confere amplos poderes para, em seu nome e por sua conta, praticar todos os atos necessários ao fiel cumprimento do presente mandato, podendo para tanto: representar o(a) outorgante perante quaisquer repartições públicas, autarquias, empresas públicas ou privadas, bancos, instituições financeiras, cartórios, juízos e tribunais; requerer certidões; assinar documentos; fazer declarações; prestar esclarecimentos; receber e dar quitação; enfim, praticar todos os atos que se fizerem necessários ao bom e fiel desempenho do presente mandato.',
      { align: 'justify' }
    );
    doc.moveDown(1.5);

    // Testemunhas (se houver)
    if (procuracaoData.testemunha1Nome || procuracaoData.testemunha2Nome) {
      doc.fontSize(12).font('Helvetica-Bold').text('TESTEMUNHAS:', { continued: false });
      doc.moveDown(0.5);
      
      if (procuracaoData.testemunha1Nome) {
        doc.fontSize(10).font('Helvetica').text(`1. ${procuracaoData.testemunha1Nome}`);
        if (procuracaoData.testemunha1Cpf) doc.text(`   CPF: ${procuracaoData.testemunha1Cpf}`);
        if (procuracaoData.testemunha1Rg) doc.text(`   RG: ${procuracaoData.testemunha1Rg}`);
        doc.moveDown(0.5);
      }
      
      if (procuracaoData.testemunha2Nome) {
        doc.fontSize(10).font('Helvetica').text(`2. ${procuracaoData.testemunha2Nome}`);
        if (procuracaoData.testemunha2Cpf) doc.text(`   CPF: ${procuracaoData.testemunha2Cpf}`);
        if (procuracaoData.testemunha2Rg) doc.text(`   RG: ${procuracaoData.testemunha2Rg}`);
        doc.moveDown(0.5);
      }
      doc.moveDown(1);
    }

    // Data e Local
    doc.fontSize(10).font('Helvetica').text(
      `${procuracaoData.cidade}, ${procuracaoData.dataEmissao || new Date().toLocaleDateString('pt-BR')}`,
      { align: 'right' }
    );
    doc.moveDown(2);

    // Assinatura
    if (procuracaoData.assinatura) {
      try {
        const signatureBuffer = Buffer.from(procuracaoData.assinatura.split(',')[1], 'base64');
        doc.image(signatureBuffer, { width: 200, align: 'center' });
      } catch (e) {
        console.error('Erro ao adicionar assinatura:', e);
      }
    }
    
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text('_'.repeat(50), { align: 'center' });
    doc.text(procuracaoData.nomeCompleto, { align: 'center' });
    doc.text('Outorgante', { align: 'center' });

    doc.end();

    const pdfBuffer = await pdfPromise;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=procuracao.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF', details: error.message });
  }
}

