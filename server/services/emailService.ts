import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

// Configuração do SMTP
const SMTP_CONFIG = {
  host: 'smtp.gmail.com', // ou outro provedor
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: 'documentos@jfg.adv.br',
    pass: '1981F@bio' // Em produção, usar variável de ambiente
  }
};

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(SMTP_CONFIG);
  }
  return transporter;
}

export async function enviarEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: `"JFG Advocacia" <${SMTP_CONFIG.auth.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

export async function enviarProcuracaoPorEmail(
  pdfBuffer: Buffer,
  numeroDocumento: string,
  nomeCliente: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #1a2847;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .footer {
          background-color: #f1f1f1;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #1a2847;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .info-box {
          background-color: #e8f4f8;
          border-left: 4px solid #1a2847;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JFG ADVOCACIA</h1>
          <p>Procuração Gerada com Sucesso</p>
        </div>
        
        <div class="content">
          <h2>Olá, Dr. José Fábio Garcez</h2>
          
          <p>Uma nova procuração foi gerada no sistema e está anexada a este email.</p>
          
          <div class="info-box">
            <strong>Informações do Documento:</strong><br>
            <strong>Número:</strong> ${numeroDocumento}<br>
            <strong>Cliente:</strong> ${nomeCliente}<br>
            <strong>Data de Emissão:</strong> ${new Date().toLocaleDateString('pt-BR')}<br>
            <strong>Tipo:</strong> Procuração
          </div>
          
          <p>O documento em PDF está anexado a este email. Você pode visualizá-lo, imprimi-lo ou armazená-lo conforme necessário.</p>
          
          <p><strong>Importante:</strong> Este documento contém assinatura digital e foto de autenticação do cliente, além de um QR Code único para verificação.</p>
          
          <p>Para mais informações ou dúvidas, acesse o painel administrativo do sistema.</p>
        </div>
        
        <div class="footer">
          <p><strong>JFG Advocacia</strong></p>
          <p>Dr. José Fábio Garcez | OAB/SP 504.270</p>
          <p>Rua Exemplo, 123 - Centro | São Paulo - SP</p>
          <p>documentos@jfg.adv.br | (11) 1234-5678</p>
          <p style="margin-top: 15px; font-size: 11px;">
            Este é um email automático. Por favor, não responda.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await enviarEmail({
    to: 'documentos@jfg.adv.br',
    subject: `Nova Procuração - ${numeroDocumento} - ${nomeCliente}`,
    html,
    attachments: [
      {
        filename: `Procuracao_${numeroDocumento}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
}

export async function enviarContratoPorEmail(
  pdfBuffer: Buffer,
  numeroDocumento: string,
  nomeCliente: string,
  emailCliente?: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #1a2847;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .footer {
          background-color: #f1f1f1;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-radius: 0 0 5px 5px;
        }
        .info-box {
          background-color: #e8f4f8;
          border-left: 4px solid #1a2847;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JFG ADVOCACIA</h1>
          <p>Contrato de Serviços Gerado</p>
        </div>
        
        <div class="content">
          <h2>Contrato de Prestação de Serviços Advocatícios</h2>
          
          <p>Um novo contrato de serviços foi gerado no sistema.</p>
          
          <div class="info-box">
            <strong>Informações do Documento:</strong><br>
            <strong>Número:</strong> ${numeroDocumento}<br>
            <strong>Cliente:</strong> ${nomeCliente}<br>
            <strong>Data de Emissão:</strong> ${new Date().toLocaleDateString('pt-BR')}<br>
            <strong>Tipo:</strong> Contrato de Serviços
          </div>
          
          <p>O contrato completo em PDF está anexado a este email, contendo:</p>
          <ul>
            <li>Identificação completa das partes</li>
            <li>Objeto do contrato e descrição dos serviços</li>
            <li>Valores e forma de pagamento</li>
            <li>Assinaturas digitais de ambas as partes</li>
            <li>QR Code único para verificação</li>
          </ul>
          
          <p><strong>Importante:</strong> Guarde este documento em local seguro. Ele possui validade jurídica e contém as assinaturas digitais das partes.</p>
        </div>
        
        <div class="footer">
          <p><strong>JFG Advocacia</strong></p>
          <p>Dr. José Fábio Garcez | OAB/SP 504.270</p>
          <p>Rua Exemplo, 123 - Centro | São Paulo - SP</p>
          <p>documentos@jfg.adv.br | (11) 1234-5678</p>
          <p style="margin-top: 15px; font-size: 11px;">
            Este é um email automático. Por favor, não responda.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Enviar para o escritório
  const enviadoEscritorio = await enviarEmail({
    to: 'documentos@jfg.adv.br',
    subject: `Novo Contrato - ${numeroDocumento} - ${nomeCliente}`,
    html,
    attachments: [
      {
        filename: `Contrato_${numeroDocumento}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });

  // Opcionalmente enviar para o cliente também
  if (emailCliente) {
    await enviarEmail({
      to: emailCliente,
      subject: `Contrato de Serviços - JFG Advocacia - ${numeroDocumento}`,
      html: html.replace('Um novo contrato', 'Seu contrato'),
      attachments: [
        {
          filename: `Contrato_${numeroDocumento}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });
  }

  return enviadoEscritorio;
}

// Função para testar configuração de email
export async function testarConexaoEmail(): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log('Conexão SMTP verificada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro na verificação SMTP:', error);
    return false;
  }
}

