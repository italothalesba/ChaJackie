import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxpFOaCxnqz2HBNHIHM4YqsM-zGnSvOPm5rTRpoOx2e1YYEZI5CA4b2oB0TR2rlf7A/exec';

  try {
    // Determine the method and body
    const method = req.method || 'GET';
    const body = method !== 'GET' ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) : undefined;

    const fetchOptions: any = {
      method,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      redirect: 'follow'
    };

    if (body) {
      fetchOptions.body = body;
      fetchOptions.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(GAS_URL, fetchOptions);
    const text = await response.text();

    if (!response.ok) {
      console.error(`Google API Error ${response.status}:`, text);
      return res.status(response.status).json({ 
        error: 'O Google Script recusou a conexão', 
        details: text.substring(0, 150) 
      });
    }

    // Attempt to parse JSON response from Google
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (e) {
      // If not JSON, but a success string (like "Sucesso")
      if (text.trim() === 'Sucesso') {
        return res.status(200).json({ status: 'ok', message: 'Sucesso' });
      }
      
      // Handle login page redirects or other HTML responses
      if (text.includes('<!doctype html>') || text.includes('google-signin')) {
        return res.status(401).json({ 
          error: 'Acesso Negado', 
          details: 'Verifique se a permissão do script está para "Qualquer pessoa".' 
        });
      }
      
      return res.status(200).json({ status: 'ok', raw: text });
    }
  } catch (error: any) {
    console.error('Proxy Exception:', error);
    return res.status(500).json({ 
      error: 'Falha crítica na ponte', 
      details: error.message 
    });
  }
}
