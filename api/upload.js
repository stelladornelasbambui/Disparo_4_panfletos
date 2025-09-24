export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Imagem não enviada" });
    }

    // Upload anônimo para Postimages
    const response = await fetch("https://api.postimages.org/1/upload", {
      method: "POST",
      body: new URLSearchParams({
        key: "anonymous",         // upload sem conta
        upload: imageBase64       // base64 cru da imagem
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const data = await response.json();

    if (!data?.url) {
      throw new Error("Falha no upload para Postimages");
    }

    return res.status(200).json({
      success: true,
      url: data.url // URL pública da imagem
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return res.status(500).json({ error: "Erro ao enviar para Postimages" });
  }
}
