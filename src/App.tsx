import React, { useState, useRef } from 'react'
import logo from './logo.svg'
import 'bulma/css/bulma.min.css'
import './App.css'
import Field from './Field'
import { store } from './store';
const DefaultState = {
  /** 每笔风险% */
  risk: 2,
  /** 账户总额 */
  balance: 500,
  /** 止损点数 */
  stopLossPoints: 100,
  /** 每点价格 */
  pointProfit: 10,
  /** 每手金额 */
  pricePerLot: 100000,
  /** 杠杆 */
  lever: 2000,
  /** 每笔手数 */
  lot: 0,
  /** 保证金 */
  pos: 0,
}
type State = typeof DefaultState
const StateKey = 'state'

const App: React.FC = () => {
  let [state, setState] = useState(store.get<State>(StateKey, DefaultState))
  ;(window as any)['store'] = store
  let timerRef = useRef(null as any)
  const update = (field: keyof (typeof state), format: (v: any) => any = Number) => (v: any) => {
    setTimeout(() => {
      setState(s => {
        s = { ...s, [field]: format(v) }
        s.lot = s.balance * (s.risk / 100) / (s.stopLossPoints * s.pointProfit)
        s.lot = Math.round(s.lot * 100) / 100
        s.pos = Number((s.pricePerLot * s.lot / s.lever).toFixed(2))
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
  return (
    <div className="container root">
      <h1 className="title">仓位计算器</h1>
      <div className="columns is-mobile is-multiline is-centered">
        <div className="column is-half">
          <Field
            type="number"
            label="账户余额"
            value={state.balance}
            unit="$"
            onChange={update('balance')}
          />
        </div>
        <div className="column is-half">
          <Field
            type="number"
            label="每笔风险"
            value={state.risk}
            unit="%"
            onChange={update('risk')}
          />
        </div>
        <div className="column is-half">
          <Field
            type="number"
            label="每点收益"
            value={state.pointProfit}
            unit="$"
            onChange={update('pointProfit')}
          />
        </div>
        <div className="column is-half">
          <Field
            type="number"
            label="每手金额"
            value={state.pricePerLot}
            unit="$"
            onChange={update('pricePerLot')}
          />
        </div>
        <div className="column is-half">
          <Field
            type="number"
            label="杠杆"
            value={state.lever}
            onChange={update('lever')}
          />
        </div>
        <div className="column is-half">
          <Field
            type="number"
            label="止损点数"
            value={state.stopLossPoints}
            onChange={update('stopLossPoints')}
          />
        </div>
        <div className="column">
          <div className="notification is-primary">
            <div>
              进场手数：<span className="result">{state.lot}</span>
            </div>
            <div>
              进场保证金：<span className="result">{state.pos}</span> $
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
