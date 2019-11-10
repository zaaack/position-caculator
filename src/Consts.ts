import Cookie from 'js-cookie'
import { store } from './store';
export const SymbolRates = {
  USD: 1,
  OIL: 57.35,
  BTC: 8860,
  XAU: 1458.48,
  EUR: 1.1021,
  GBP: 1.2793,
  AUD: 0.6856,
  CAD: 0.7558,
  CHF: 1.0021,
  JPY: 0.009153,
  NZD: 0.6327,
}

const ForexLotSize = 100000
const ForexTickSize = 0.0001
export const SymbolConfs = {
  USOIL: {
    tickSize: 0.01,
    lotSize: 1000,
  },
  BTCUSD: {
    tickSize: 0.1,
    lotSize: 1,
  },
  XAUUSD: {
    tickSize: 0.01,
    lotSize: 100,
  },
  USDJPY: {
    tickSize: 0.01,
    lotSize: ForexLotSize,
  },
  USDCHF: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  USDCAD: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  GBPUSD: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  AUDUSD: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  NZDUSD: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  EURUSD: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  EURGBP: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  EURCHF: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  EURNZD: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  GBPJPY: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  GBPCAD: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  GBPNZD: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  GBPCHF: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  AUDCAD: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  AUDCHF: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  AUDNZD: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  AUDGBP: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  AUDJPY: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  CADCHF: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
  CADJPY: {
    tickSize: ForexTickSize,
    lotSize: ForexLotSize,
  },
}
/*
也都以美元来计算结果。例如欧元兑英镑，欧元为基本货币，英镑为报价货币。

计算交叉盘外汇对的点值
公式：点值 = 手数(lot size) x 基点(tick size) x 基本货币与美元的汇率(base quote) / 该外汇的汇

率(current rate)
例如：在0.6750时买入100000欧元兑英镑的合约，这个时候欧美的汇率为1.1840
1点值 = 100000（手数）x 0.0001（基点）x 1.840（欧美汇率） / 0.6750（欧元兑英镑汇率）= $17.54
*/
export const Symbols = Object.keys(SymbolConfs)

export type Currency = keyof (typeof SymbolRates)
export type Symbol = keyof (typeof SymbolConfs)


export function getCurrency(symbol: Symbol) {
  if (symbol === 'USOIL') {
    return { basic: 'OIL' as Currency, quote: 'USD' as Currency }
  }
  const currencies = Object.keys(SymbolRates)
  let basic = currencies.find(s => symbol.startsWith(s)) as Currency
  let quote = currencies.find(s => symbol.endsWith(s)) as Currency
  if (!basic || !quote) {
    throw new Error(`Cannot find currency: ${basic} ${quote}`)
  }
  return { basic, quote }
}

export function getPointProfit(symbol: Symbol) {
  if (symbol === 'USOIL') {
    return SymbolConfs[symbol].lotSize * SymbolConfs[symbol].tickSize * SymbolRates.OIL / SymbolRates.OIL
  }
  const { basic, quote } = getCurrency(symbol)
  return SymbolConfs[symbol].lotSize * SymbolConfs[symbol].tickSize * SymbolRates[basic] / (SymbolRates[basic] / SymbolRates[quote])
}

let lastResult = ''
async function loadCurrency(currency: string) {
  let script = document.createElement('script')
  script.src = `https://api.jijinhao.com/plus/convert.htm?from_tkc=${currency}&to_tkc=USD&amount=1&_=1573363635187`
  document.body.appendChild(script)
  return new Promise<number>((res,rej) => {
    script.onerror = rej
    script.onload = () => {
      let result = (window as any)['result']
      if (typeof result === 'string' && /^[\d.]+$/.test(result) && result !==lastResult) {
        res(Number(result))
        lastResult = result
      }
      document.body.removeChild(script)
    }
  })
}

export const UpdateExpireKey = 'updated_currency'
export const CurrencyExchangeKey = 'currency_exchange'
export const StateKey = 'state'
;(async () => {
  console.info(`跳过加载: BTC, OIL`)
  const lastUpdateTime = Cookie.get(UpdateExpireKey)
  if (
    lastUpdateTime
  ) {
    const Hour = 3600 * 1000
    Object.assign(SymbolRates, store.get<object>(CurrencyExchangeKey, {}))
    console.log(`${((Number(lastUpdateTime) + Hour * 24 - Date.now()) / Hour).toFixed(2)}小时后更新汇率`)
    return
  }
  for (const cur in SymbolRates) {
    if (['USD', 'OIL', 'BTC'].includes(cur)) continue
    try {
      let result = await loadCurrency(cur)
      ;(SymbolRates as any)[cur] = result
      console.info(`加载最新的 ${cur}/USD: ${result}`)
    } catch (error) {
      console.error(`加载 ${cur}/USD 失败.`, error)
    }
  }
  store.set(CurrencyExchangeKey, SymbolRates)
  Cookie.set(UpdateExpireKey, String(Date.now()), {expires: 1 })
})()

window.onerror = (msg)=> {
  if (typeof msg !== 'string') return
  if (/Script error/.test(msg)) return
  store.delete(CurrencyExchangeKey)
  store.delete(StateKey)
  window.location.reload()
}
