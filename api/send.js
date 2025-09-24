export default async function handler(req, res) {
  console.log("📩 Payload recebido:", req.body);
  return res.status(200).json({
    msg: "Chegou no Vercel!",
    payload: req.body
  });
}
