// api/callback.js
// O GitHub redireciona o usuário pra cá depois de ele autorizar o login.
// Essa função troca o "code" temporário por um token de acesso de verdade,
// e devolve esse token pra janela do Decap CMS que abriu o login.

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    res.status(400).send("Código de autorização ausente.");
    return;
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      res.status(400).send(`Erro do GitHub: ${tokenData.error_description}`);
      return;
    }

    const token = tokenData.access_token;

    // Essa página se comunica com a janela do painel administrativo (Decap CMS)
    // que abriu essa tela de login, enviando o token pra ela.
    const script = `
      <html>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
                window.opener.postMessage(
                  'authorization:github:success:${JSON.stringify({
                    token,
                    provider: "github",
                  })}',
                  e.origin
                );
                window.removeEventListener("message", receiveMessage, false);
              }
              window.addEventListener("message", receiveMessage, false);
              window.opener.postMessage("authorizing:github", "*");
            })();
          </script>
          Login concluído. Você pode fechar esta janela.
        </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(script);
  } catch (err) {
    res.status(500).send("Erro ao trocar o código pelo token: " + err.message);
  }
}
