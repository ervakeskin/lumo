import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getGame, isPlayable } from '../games/registry'
import GameShell from '../engine/GameShell'

export default function Play() {
  const { id = '' } = useParams()
  const game = getGame(id)
  const [run, setRun] = useState(0)
  if (!game || !isPlayable(game)) return <Navigate to="/oyunlar" replace />
  // key: "Tekrar Oyna" tüm oyun state'ini sıfırlar
  return <GameShell key={`${game.id}-${run}`} game={game} onReplay={() => setRun((r) => r + 1)} />
}
