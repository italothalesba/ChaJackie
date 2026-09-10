import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
      return res.status(response.status).json({ 
        error: 'Erro no Google Script', 
        details: text.substring(0, 200) 
      });
    }

    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch (e) {
      if (text.includes('Service Login') || text.includes('google-signin') || text.includes('<!doctype html>')) {
        return res.status(401).json({ 
          error: 'Acesso Negado pelo Google', 
          details: 'O Script exige login. Mude "Quem pode acessar" para "Qualquer pessoa" (Anyone) na implantação do Google.' 
        });
      }
      res.status(500).json({ error: 'Resposta inválida do Google', details: text.substring(0, 100) });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Falha na conexão com a ponte', details: error.message });
  }
}
