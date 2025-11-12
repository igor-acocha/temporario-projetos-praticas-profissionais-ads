package com.tcc.user.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final SendGrid sendGrid;

    public EmailService() {
        // Recupera a chave do ambiente (Railway → Variables)
        String apiKey = System.getenv("SENDGRID_API_KEY");
        this.sendGrid = new SendGrid(apiKey);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String subject = "🔒 Redefinição de senha — Seu código de verificação";

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body {
                      font-family: 'Arial', sans-serif;
                      color: #333;
                      background-color: #f6f6f6;
                      padding: 30px;
                    }
                    .container {
                      background: #ffffff;
                      border-radius: 10px;
                      padding: 25px;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                      max-width: 500px;
                      margin: auto;
                    }
                    h2 { color: #1e40af; }
                    .code {
                      display: inline-block;
                      background: #eef2ff;
                      color: #1e40af;
                      font-weight: bold;
                      font-size: 22px;
                      letter-spacing: 2px;
                      padding: 12px 25px;
                      border-radius: 10px;
                      margin: 20px 0;
                    }
                    p { line-height: 1.5; font-size: 15px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h2>Redefinição de Senha</h2>
                    <p>Olá,</p>
                    <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
                    <p>Use o código abaixo para continuar:</p>
                    <div class="code">%s</div>
                    <p>Este código expira em <b>15 minutos</b>.</p>
                    <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
                    <br/>
                    <p>Atenciosamente,<br><b>Equipe Tech Start</b></p>
                  </div>
                </body>
                </html>
                """.formatted(token);

        Email from = new Email("techhstart@gmail.com"); // precisa estar verificado no SendGrid
        Email recipient = new Email(to);
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, recipient, content);

        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);
            int status = response.getStatusCode();

            if (status < 200 || status >= 300) {
                throw new RuntimeException("Falha ao enviar e-mail. Status: " + status +
                        " | Corpo: " + response.getBody());
            }

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail via SendGrid", e);
        }
    }
}