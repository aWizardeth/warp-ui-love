"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { Lock } from "lucide-react"
import { WATCHER_API_ROOT } from "../bridge/config"

interface StatsResponse {
  total_messages: number
  messages_to_chia: number
  messages_from_chia: number
  milliETH_total_volume: number
  milliETH_locked: number
  XCH_total_volume: number
  XCH_locked: number
  USDT_total_volume: number
  USDT_locked: number
  DBX_total_volume: number
  DBX_locked: number
  SPROUT_total_volume: number
  SPROUT_locked: number
  LOVE_locked: number
  LOVE_total_volume: number
  PIZZA_total_volume: number
  PIZZA_locked: number
  CASTER_total_volume: number
  CASTER_locked: number
    // Add fallback types for potential new tokens
  [key: string]: number;
}

const liveAppsConfig = [

  {
    name: "CAT Bridge",
    tokens: [
      {
        symbol: "✨❤️‍🔥🧙‍♂️",
        accessorPrefixKey: "✨❤️‍🔥🧙‍♂️", // Ensure this matches how data keys are stored/used
        decimals: 3
      },
      {
        symbol: "🌱",
        accessorPrefixKey: "SPROUT",
        decimals: 3
      },      
      {
        symbol: "❤️",
        accessorPrefixKey: "LOVE",
        decimals: 3
      },
      {
        symbol: "🍕",
        accessorPrefixKey: "PIZZA",
        decimals: 3
      },
      {
        symbol: "🧙‍♂️",
        accessorPrefixKey: "MANA",
        decimals: 3
      },
      {
        symbol: "🪄⚡️",
        accessorPrefixKey: "SP",
        decimals: 3
      },      
      {
        symbol: "🍊",
        accessorPrefixKey: "HOA",
        decimals: 3
      },

    ]
  },
  {
    name: "ERC-20 Bridge",
    tokens: [
      {
        symbol: "USDC",
        accessorPrefixKey: "USDC",
        decimals: 3
      },
      {
        symbol: "ETH",
        accessorPrefixKey: "milliETH",
        decimals: 6
      },
      {
        symbol: "USDT",
        accessorPrefixKey: "USDT",
        decimals: 3
      }
    ]
  }
]

const formatNumber = (num: number, decimals: number) => {
  let number = num
  if (!num) number = 0
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    notation: "compact"
  }).format(number / Math.pow(10, decimals))
}

function LiveApps({ appIndex = 0 }: { appIndex: number }) {
  const { data, isLoading } = useQuery<StatsResponse>({
    queryKey: ['landingPage_stats'],
    queryFn: () => fetch(`${WATCHER_API_ROOT}stats`).then(res => res.json())
  })

  // Logging the entire data object for inspection
  console.log("Fetched data:", data);
  if (isLoading || !data) return <div className="h-full min-h-[350px]"></div>


  const getTokenTableRow = (token: typeof liveAppsConfig[0]["tokens"][0]) => {
    const lockedKey = `${token.accessorPrefixKey}_locked` as keyof StatsResponse;
    const volumeKey = `${token.accessorPrefixKey}_total_volume` as keyof StatsResponse;
    // Log specific key values
    console.log(`Data for ${token.symbol}: Locked =`, data[lockedKey], ", Total Volume =", data[volumeKey]);
    
    const lockedValue = formatNumber(data[lockedKey], token.decimals);
    const volumeValue = formatNumber(data[volumeKey], token.decimals);
    return (
      <tr className="border-b last:border-0" key={token.accessorPrefixKey}>
        <td className="text-center py-2">
          <p className="text-xl">{lockedValue} {token.symbol}</p>
          <p className="opacity-50">Locked</p>
        </td>
        <td className="text-center">
          <div>
            <p className="text-xl">{volumeValue} {token.symbol}</p>
            <p className="opacity-50">Total Volume</p>
          </div>
        </td>
      </tr>
    )
  }

  const formatApp = (app: typeof liveAppsConfig[0]) => {
    return (
      <div key={app.name} className="w-full h-full p-6">
        <p className="text-xl mb-4 text-center">{app.name}</p>
        <table className="w-full py-2 h-[calc(100%-2rem)]">
          <tbody>
            {app.tokens.map(getTokenTableRow)}
          </tbody>
        </table>
      </div>
    )
  }



  return <>{formatApp(liveAppsConfig[appIndex])}</>
}

export default LiveApps
