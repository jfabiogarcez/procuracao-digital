import type { Express } from "express";
import { z } from "zod";
import nodemailer from "nodemailer";

const contatoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  assunto: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

export function registerContatoRoutes(app: Express) {
  app.post("/api/contato", async (req, res) => {
    try {
      const dados = contatoSchema.parse(req.body);

      // Configurar transporter do nodemailer (Locaweb)
      const transporter = nodemailer.createTransporter({
        host: "email-ssl.com.br",
        port: 465,
        secure: true, // SSL/TLS
        auth: {
          user: "contato@jfg.adv.br",
          pass: "1981F@bio",
        },
      });

      // Email para o advogado
      const mailOptions = {
        from: "contato@jfg.adv.br",
        to: "contato@jfg.adv.br",
        subject: `[Site JFG] ${dados.assunto}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a2847; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Nova Mensagem do Site</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #1a2847; border-bottom: 2px solid #1a2847; padding-bottom: 10px;">
                Dados do Contato
              </h2>
              
              <table style="width: 100%; margin: 20px 0;">
                <tr>
                  <td style="padding: 10px; background-color: white; border: 1px solid #ddd;">
                    <strong>Nome:</strong>
                  </td>
                  <td style="padding: 10px; background-color: white; border: 1px solid #ddd;">
                    ${dados.nome}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: white; border: 1px solid #ddd;">
                    <strong>Email:</strong>
                  </td>
                  <td style="padding: 10px; background-color: white; border: 1px solid #ddd;">
                    <a href="mailto:${dados.email}">${dados.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: white; border: 1px solid #ddd;">
                    <strong>Telefone:</strong>
                  </td>
                  <td style="padding: 10px; background-color: white; border: 1px solid #ddd;">
                    <a href="tel:${dados.telefone}">${dados.telefone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: white; border: 1px solid #ddd;">
                    <strong>Assunto:</strong>
                  </td>
                  <td style="padding: 10px; background-color: white; border: 1px solid #ddd;">
                    ${dados.assunto}
                  </td>
                </tr>
              </table>
              
              <h3 style="color: #1a2847; margin-top: 30px;">Mensagem:</h3>
              <div style="background-color: white; padding: 20px; border-left: 4px solid #1a2847; margin: 10px 0;">
                ${dados.mensagem.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background-color: #1a2847; padding: 15px; text-align: center; color: white; font-size: 12px;">
              <p style="margin: 0;">JFG Advocacia - Excelência Jurídica com Compromisso e Resultados</p>
              <p style="margin: 5px 0 0 0;">Rua Capitão Antônio Rosa, 409 - São Paulo/SP</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.json({ 
        success: true, 
        message: "Mensagem enviada com sucesso!" 
      });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          error: "Dados inválidos", 
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        error: "Erro ao enviar mensagem. Tente novamente." 
      });
    }
  });
}

