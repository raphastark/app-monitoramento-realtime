export default async function handler(req, res) {
  try {
    const { dataInicial, dataFinal } = req.query;
    const url = `https://dados.mobilidade.rio/gps/sppo?dataInicial=${dataInicial}&dataFinal=${dataFinal}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream error: ${response.status}` });
    }
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SPPO data' });
  }
}
