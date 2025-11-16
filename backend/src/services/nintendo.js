const fetch = require('node-fetch');

/**
 * Fetch price info for a given NSUID from Nintendo unofficial API.
 * Note: Nintendo internal APIs are unofficial and can change.
 * This function returns parsed structure:
 * { nsuid, country, final_price_amount, regular_price_amount, discount_percent }
 */
async function fetchPriceByNsuid(nsuid, country='US'){
  const url = `https://api.ec.nintendo.com/v1/price?country=${country}&ids=${nsuid}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'np-backend/1.0' }});
  if(!res.ok) {
    const txt = await res.text();
    throw new Error(`Nintendo price API ${res.status} - ${txt.substring(0,200)}`);
  }
  const data = await res.json();
  // Try to parse common fields
  // Data shape example may vary. We attempt safe access.
  const item = (data && data.prices && data.prices[0]) || null;
  if(!item) return null;
  // Attempt to read amounts
  const final = item.final_price || item.price || null;
  const regular = item.regular_price || item.price || null;
  const final_amount = final ? (final.amount || null) : null;
  const regular_amount = regular ? (regular.amount || null) : null;
  const discount = item.discount_percentage || item.discount || 0;
  return {
    nsuid, country,
    final_price_amount: final_amount,
    regular_price_amount: regular_amount,
    discount_percent: discount
  };
}

module.exports = { fetchPriceByNsuid };
