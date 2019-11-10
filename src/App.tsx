import React, { useState, useRef } from 'react'
import logo from './logo.svg'
import 'bulma/css/bulma.min.css'
import './App.css'
import Field from './Field'
import { store } from './store';
import { getPointProfit, Symbol, getCurrency, SymbolConfs, SymbolRates, Symbols, CurrencyExchangeKey } from './Consts';


const DefaultState = {
  /** 每笔风险% */
  risk: 2,
  /** 账户总额 */
  balance: 500,
  /** 止损点数 */
  stopLossPoints: 100,
  // /** 每点价格 */
  // pointProfit: 10,
  // /** 每手金额 */
  // pricePerLot: ForexLotSize,
  /** 杠杆 */
  lever: 2000,
  /** 货币对 */
  symbol: 'USDCHF' as Symbol,
}
type State = typeof DefaultState
const StateKey = 'state'


// Symbols.forEach(s => console.log(s, getPointProfit(s as Symbol)))

const App: React.FC = () => {
  let [state, setState] = useState(store.get<State>(StateKey, DefaultState))
  ;(window as any)['store'] = store
  let timerRef = useRef(null as any)
  const update = (field: keyof (typeof state), format: (v: any) => any = f => f) => (v: any) => {
    setTimeout(() => {
      setState(s => {
        s = { ...s, [field]: format(v) }
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        timerRef.current = setTimeout(() => {
          store.set(StateKey, s)
          timerRef.current = null
        }, 1000)
        return s
      })
    })
  }
  const updateNum = (field: keyof (typeof state)) => update(field, Number)
  /** 每点的点值(每点值多少美元) */
  const pointProfit = getPointProfit(state.symbol)
  /** 每笔手数 */
  let lots = state.balance * (state.risk / 100) / (state.stopLossPoints * pointProfit)
  lots = Math.round(lots * 100) / 100
  const { basic, quote } = getCurrency(state.symbol)
  /** 每手美元 */
  const pricePerLot = SymbolConfs[state.symbol].lotSize * SymbolRates[basic]
  /** 保证金 */
  let pos = Number((pricePerLot * lots / state.lever).toFixed(2))
  return (
    <div className="container root">
      <h1 className="title">仓位计算器</h1>
      <div className="columns is-mobile is-multiline is-centered">
        <div className="column is-half">
          <Field
            type="number"
            label="账户余额"
            value={state.balance}
            left="$"
            onChange={updateNum('balance')}
          />
        </div>
        <div className="column is-half">
          <Field
            type="number"
            label="每笔风险"
            value={state.risk}
            right="%"
            onChange={updateNum('risk')}
          />
        </div>
        <div className="column is-half">
          <Field
            type="select"
            label="货币对"
            value={state.symbol}
            options={Symbols.map(s => ({ value: s }))}
            onChange={update('symbol')}
          />
          {/* <Field
            type="number"
            label="每点收益"
            value={state.pointProfit}
            left="$"
            onChange={update('pointProfit')}
          /> */}
        </div>
        <div className="column is-half">
          <Field
            type="number"
            label="杠杆"
            value={state.lever}
            onChange={updateNum('lever')}
          />
        </div>
        <div className="column is-half">
          <Field
            type="number"
            label="止损点数"
            value={state.stopLossPoints}
            onChange={updateNum('stopLossPoints')}
          />
        </div>
        <div className="column is-half">
          {['BTCUSD', 'USOIL'].includes(state.symbol) && (() => {
            const cur = state.symbol === 'BTCUSD' ? 'BTC' : 'OIL'
            return (
              <Field
                type="number"
                label={`${cur}兑美元`}
                value={SymbolRates[cur]}
                onChange={e => {
                  setTimeout(() => {
                    SymbolRates[cur] = e
                    store.set(CurrencyExchangeKey, SymbolRates)
                    setState({...state})
                  })
                }}
              />
            )
          })()}
        </div>
        <div className="column is-full">
          <div className="notification is-primary">
            <div>
              进场手数：<span className="result">{lots}</span>手
            </div>
            <div>
              进场保证金：<span className="result">${pos}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
