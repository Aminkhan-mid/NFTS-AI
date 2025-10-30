import "dotenv/config"
import express, { json } from "express"
import fetch from "node-fetch"
import { GoogleGenerativeAI } from "@google/generative-ai"

const server = express()
const PORT = 4000

server.use(express.json())
server.use(express.static("public"))

const NFTkey = process.env.NFT_KEY
console.log("🔑 API KEY is:", NFTkey ? "Loaded ✅" : "❌ Missing!")
const contractAddress = "0xed5af388653567af2f388e6224dc7c4b3241c544"; 
server.get("/api/nft", async (req, res) => {
    try{
        console.log("📡 Fetching NFT DATA...")
        const resNFT = await fetch(
            `https://deep-index.moralis.io/api/v2/nft/${contractAddress}?chain=eth&format=decimal&limit=15`, {
                headers: { "X-API-Key": NFTkey},
            }
        )
        const data = await resNFT.json()
        console.log("🧾 Raw API data keys:", Object.keys(data))
        console.log("🧾 Sample:", data.result ? data.result[0] : data)

        if(data.result && data.result.length > 0){
            const nftList = data.result.slice(0, 10).map((item) => {

                const nft = item.metadata ? JSON.parse(item.metadata) : {}
                const imageURL = nft.image?.replace("ipfs://", "https://ipfs.io/ipfs/") || ""
                const name = nft.name || item.name || "Unnamed NFT"
                const type = item.contract_type || "Unknown"
                const attributes = nft.attributes || []
                   console.log("🗞️ Full Metadata:", nft)
                    console.log("✅ NFT name:", name)
                    console.log("🌠 NFT image:", imageURL)
                    console.log("📦 Contract Type:", type) 
                return {name, imageURL, type, attributes} 
        })
        console.log(`✅ Returning ${nftList.length} NFTs`)
        return res.json(nftList)
        } else {
            console.log("⚠️ No NFT data returned.")
            res.json([])
        }
    }catch (err){
        console.error("❌ Error in api/nft:", err)
        res.status(500).json({error: "server error"})
    }
})

server.post("/api/nft/describe", async (req, res) => {
    const {name, description} = req.body
    if(!name && !description){
        return res.status(400).json({error: "Missing NFT details for AI"})
    }
    const prompt = `
    You are a creative NFT curator and critic.
    NFT name: "${name}"
    Description: "${description || "No extra details"}"

    Follow these rules strictly:
    1. Respond in pure JSON only (no markdown, no code block).
    2. The "shortDesc" must be **max 8 words**, one artistic tagline or name that sounds mysterious or cool.
    3. The "longDesc" must be **max 40 words**, descriptive but stylish, like a short gallery caption,  DO NOT START WITH THE 'Name', always start with a capital letter.
    4. "shouldIBuy" must be only **2-3 words** and include a fun aesthetic looking emoji.

    Format:
    {
    "shortDesc": "max 8 words only, artistic line",
    "longDesc": "max 40 words, creative and elegant tone",
    "shouldIBuy": "2-3 words with emoji"
    }`

     try {
    const ai = new GoogleGenerativeAI(process.env.AI_KEY)
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" })

    const results = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    })

    const rawText = results.response.text()
    const dataAI = JSON.parse(rawText)
    console.log("🧠 AI Response:", dataAI)

    res.json(dataAI)
  } catch (err) {
    console.error("❌ Error in /api/nft/describe:", err)
    res.status(500).json({ error: "AI server error" })
  }
})

server.post("/api/nft/buy", async (req, res) => {
  const { name, description } = req.body;
  if (!name && !description) {
    return res.status(400).json({ error: "Missing NFT details for AI" });
  }

  const prompt = `
  You are a stylish NFT curator creating content for a Buy NFT page.

  NFT name: "${name}"
  Description: "${description || "No details"}"

  Rules:
  1. Respond in pure JSON (no markdown/code).
  2. "shortDesc": max 8 words, artistic, tagline-style.
  3. "longDesc": max 35 words, elegant tone, like a collector’s caption. Don’t start with the name.
  4. "shouldIBuy": only 2-3 words with a cool emoji.
  5. Keep it engaging, luxury-vibe, and concise.

  Format:
  {
  "shortDesc": "max 8 words, artistic and cool",
  "longDesc": "max 35 words, poetic and elegant",
  "shouldIBuy": "2-3 words + emoji"
  }`;

  try {
    const ai = new GoogleGenerativeAI(process.env.AI_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ✅ Simpler, compatible call
    const result = await model.generateContent(prompt);


    let rawText = result.response.text().trim()

    rawText = rawText
  .replace(/^```json\s*/i, "") // remove starting ```json
  .replace(/^```/, "")         // or ``` at start
  .replace(/```$/, "")         // or ``` at end
  .replace(/Sure!|Here's|Output:|Response:/gi, "") // common AI chatter
  .trim()

console.log("🧠 Cleaned AI Text:", rawText)

  let dataAI
try {
  dataAI = JSON.parse(rawText)
} catch (err) {
  console.error("❌ JSON parse failed, returning fallback:", err)
  dataAI = { shortDesc: "Art speaks louder 🎨", longDesc: "This NFT defies words — a collector’s dream rendered in pixels.", shouldIBuy: "Maybe 💭" }
}

res.json(dataAI)
  } catch (err) {
    console.error("❌ Error in /api/nft/buy:", err);
    res.status(500).json({ error: "AI server error" });
  }
});

    
server.listen(PORT, ()=> {
    console.log(`✅🟣🟣 Server running at http://localhost:${PORT}`)
})
