[README.md](https://github.com/user-attachments/files/31605925/README.md)
# Decap CMS OAuth Provider (para SomenteCrer)

Este projeto é a "ponte" que permite ao painel administrativo (Decap CMS) do
site fazer login com o GitHub. Ele não guarda nada, não tem banco de dados —
só troca um código temporário do GitHub por um token de acesso, e entrega
esse token pro painel.

## Como usar

1. Suba esta pasta inteira para um repositório novo no GitHub (ex: `decap-oauth-provider`).
2. Importe esse repositório na Vercel (vercel.com > Add New > Project).
3. Nas "Environment Variables" do projeto na Vercel, adicione:
   - `OAUTH_CLIENT_ID` → o Client ID do seu GitHub OAuth App
   - `OAUTH_CLIENT_SECRET` → o Client Secret do seu GitHub OAuth App
4. Depois do deploy, pegue a URL que a Vercel gerou (ex: `https://decap-oauth-provider.vercel.app`).
5. Volte nas configurações do GitHub OAuth App e atualize a "Authorization callback URL" para:
   `https://SUA-URL-DA-VERCEL.vercel.app/api/callback`
6. No `admin/config.yml` do site, defina:
   ```yaml
   backend:
     name: github
     repo: seu-usuario/somentecrer
     branch: main
     base_url: https://SUA-URL-DA-VERCEL.vercel.app
     auth_endpoint: api/auth
   ```

Pronto — o botão de login do painel administrativo vai usar esse serviço
para autenticar contra o GitHub.
