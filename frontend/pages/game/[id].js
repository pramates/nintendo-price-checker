import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Line } from 'react-chartjs-2'
const fetcher = (u) => fetch(u).then(r=>r.json())

export default function GamePage(){
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(id ? `/api/games/${id}` : null, fetcher)

  if(error) return <div>Error</div>
  if(!data) return <div>Loading...</div>

  const { game, prices } = data
  // simple chart from price history endpoint
  const { data: history } = useSWR(`/api/prices/history/${id}`, fetcher)
  const chartData = {
    labels: history ? history.map(h => new Date(h.recorded_at).toLocaleString()) : [],
    datasets: [
      {
        label: 'Price (minor units)',
        data: history ? history.map(h => h.price_minor) : [],
        tension: 0.3,
        fill: false,
      }
    ]
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{game.title}</h1>
      <h3>Prices</h3>
      <ul>
        {prices.map(p => <li key={p.id}>{p.country_code} - {p.price_minor/100} ({p.discount_percent}% off)</li>)}
      </ul>

      <h3>Price history</h3>
      {history ? <Line data={chartData} /> : <div>Loading history...</div>}
    </div>
  )
}
