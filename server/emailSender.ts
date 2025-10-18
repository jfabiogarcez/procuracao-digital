import nodemailer from "nodemailer";

export async function sendProcuracaoEmail(params: {
  pdfUrl: string;
  nomeOutorgante: string;
  emailDestino: string;
}) {
  // Configurar transporter (usando Gmail como exemplo)
  // Em produção, use variáveis de ambiente para credenciais
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "jose.fabio.garcez@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "", // Senha de app do Gmail
    },
  });

  const mailOptions = {
    from: '"JFG Advocacia" <jose.fabio.garcez@gmail.com>',
    to: params.emailDestino,
    subject: `Procuracao Digital - ${params.nomeOutorgante}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">JFG Advocacia</h2>
        <h3>Procuracao Digital Recebida</h3>
        
        <p>Prezado Dr. Jose Fabio Garcez,</p>
        
        <p>Uma nova procuracao digital foi gerada pelo(a) cliente <strong>${params.nomeOutorgante}</strong>.</p>
        
        <p>Acesse o documento PDF atraves do link abaixo:</p>
        
        <p style="margin: 20px 0;">
          <a href="${params.pdfUrl}" 
             style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Baixar Procuracao PDF
          </a>
        </p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Este e-mail foi gerado automaticamente pelo Sistema de Procuracao Digital JFG Advocacia.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #666;">
          <strong>JFG Advocacia</strong><br>
          Rua Capitao Antonio Rosa, 409, 1 Andar, Edificio Spaces<br>
          Jardim Paulistano, Sao Paulo/SP, CEP 01443-010<br>
          WhatsApp: (11) 9 4721-9180<br>
          E-mail: jose.fabio.garcez@gmail.com
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[Email] Enviado com sucesso:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Email] Erro ao enviar:", error);
    return { success: false, error: String(error) };
  }
}

