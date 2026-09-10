import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ROTA DE PONTE (PROXY) PARA O GOOGLE SCRIPT
  // Isso resolve o erro de CORS porque o servidor busca os dados, não o navegador.
  app.all('/api/proxy', async (req, res) => {
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbxpFOaCxnqz2HBNHIHM4YqsM-zGnSvOPm5rTRpoOx2e1YYEZI5CA4b2oB0TR2rlf7A/exec';
    
    try {
      const fetchOptions: any = {
        method: req.method,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        redirect: 'follow'
      };

      if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
        fetchOptions.body = JSON.stringify(req.body);
        fetchOptions.headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(GAS_URL, fetchOptions);
      const text = await response.text();

      if (!response.ok) {
        console.error(`Google retornou erro ${response.status}: ${text}`);
        return res.status(response.status).json({ 
          error: 'Erro no Google Script', 
          details: text.substring(0, 200) 
        });
      }

      try {
        const data = JSON.parse(text);
        res.json(data);
      } catch (e) {
        // Detectar se o Google está pedindo login
        if (text.includes('Service Login') || text.includes('google-signin') || text.includes('<!doctype html>')) {
          console.error('Google retornou HTML em vez de JSON. Provavelmente exige login.');
          return res.status(401).json({ 
            error: 'Acesso Negado pelo Google', 
            details: 'O Script exige login. Mude "Quem pode acessar" para "Qualquer pessoa" (Anyone) na implantação do Google.' 
          });
        }
        res.status(500).json({ error: 'Resposta inválida do Google', details: text.substring(0, 100) });
      }
    } catch (error: any) {
      console.error('Erro na ponte (proxy):', error);
      res.status(500).json({ error: 'Falha na conexão com a ponte', details: error.message });
    }
  });

  // Middleware do Vite para desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de ponte rodando em http://localhost:${PORT}`);
  });
}

startServer();
