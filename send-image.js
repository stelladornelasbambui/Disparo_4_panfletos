export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { phone, caption, image } = req.body;

  try {
    const response = await fetch(
      "https://api.z-api.io/instances/{3DF2EE19A630504B2B138E66062CE0C1}/token/{9BD3BD5E35E12EA3B0B88D07}/send-image",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, caption, image })
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao conectar na Z-API", details: err.message });
  }
}
