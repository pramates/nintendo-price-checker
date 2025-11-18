
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const prisma = new PrismaClient();

export async function runPriceUpdate(){
  console.log("Updating prices...");
  const res = await fetch("https://api.ec.nintendo.com/v1/price?country=US&lang=en");
  const data = await res.json();

  for (const game of data?.prices || []) {
    await prisma.game.upsert({
      where:{ id: game.title_id },
      update:{ price: game.regular_price?.amount || 0, currency: game.regular_price?.currency || "USD"},
      create:{ id: game.title_id, price: game.regular_price?.amount || 0, currency: game.regular_price?.currency || "USD"}
    });
  }
  console.log("Done.");
}
