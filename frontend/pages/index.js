import useSWR from 'swr'
import Link from 'next/link'
const fetcher = (u) => fetch(u).then(r=>r.json())

export default function Home(){
  const { data: games, error } = useSWR('/api/games', fetcher)

  if(error) return <div>Error loading</div>
  if(!games) return <div>Loading...</div>
  return (
    <div style={{ padding: 20 }}>
      <h1>Switch Price Checker</h1>
      <p>Example project — click a game to view prices.</p>
      <ul>
        {games.map(g => (
          <li key={g.id}><Link href={`/game/${g.id}`}><a>{g.title}</a></Link></li>
        ))}
      </ul>
    </div>
  )
}
