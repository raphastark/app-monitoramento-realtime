export default async function handler(req, res) {
  try {
    const response = await fetch('https://dados.mobilidade.rio/gps/brt');
    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream error: ${response.status}` });
    }
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch BRT data' });
  }
}
