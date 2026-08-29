// api/auth.js
// Este arquivo inicia o processo de login: redireciona o usuário para o GitHub
// pedindo autorização de acesso.

export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const scope = "repo,user";

  const redirectUri = `${getBaseUrl(req)}/api/callback`;

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}`;

  res.writeHead(302, { Location: githubAuthUrl });
  res.end();
}

function getBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  return `${proto}://${host}`;
}
