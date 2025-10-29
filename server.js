import "dotenv/config"
import express from "express"
import fetch from "node-fetch"

const server = express()
const PORT = 4000

server.use(express.json())
server.use(express.static("public"))

const apiKey = process.env.NFT_KEY
console.log("🔑 API KEY is:", apiKey ? "Loaded ✅" : "❌ Missing!")

const contractAddress = "0xed5af388653567af2f388e6224dc7c4b3241c544"; 



server.get("/api/nft", async (req, res) => {
    try{
        console.log("📡 Fetching NFT DATA...")
        const resNFT = await fetch(
            `https://deep-index.moralis.io/api/v2/nft/${contractAddress}?chain=eth&format=decimal&limit=15`, {
                headers: { "X-API-Key": apiKey},
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
    
    
    
    
server.listen(PORT, ()=> {
    console.log(`✅🟣🟣 Server running at http://localhost:${PORT}`)
})
