
import express from "express";
import { runPriceUpdate } from "./worker/updatePrices.js";

const app = express();
app.use(express.json());

app.post("/api/update-prices", async (req, res) => {
  if (process.env.CRON_SECRET && req.headers["x-cron-secret"] !== process.env.CRON_SECRET) {
    return res.status(403).json({ error: "unauthorized" });
  }
  try {
    await runPriceUpdate();
    res.json({ status: "ok" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error:"update failed" });
  }
});

app.get("/", (req,res)=>res.send("Backend running"));

const port=process.env.PORT||3000;
app.listen(port,()=>console.log("Server running on "+port));
