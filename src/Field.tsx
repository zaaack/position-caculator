import React from "react";
export interface Props {
  label: string
  value: string | number
  onChange: (val: any) => void
  right?: any
  left?: any
  type: string
  disabled?: boolean
  options?: { label?: string, value: string }[]
}
const Field = (props: Props) => {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{props.label}</label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className={`control ${props.right ? 'has-icons-right' : ''} ${props.left ? 'has-icons-left' : ''}`}>
            {props.type === 'select' ? (
              <div className="select">
                <select onChange={e => props.onChange(e.target.value)} value={props.value}>
                  {(props.options || []).map(opt => {
                    return <option value={opt.value}>{opt.label || opt.value}</option>
                  })}
                </select>
              </div>
            ) : (

              <input disabled={props.disabled} className="input" type={props.type} value={props.value} onChange={e => props.onChange((e.target as any).value)} />
            )}
            {props.left && (
              <span className="is-left icon">
                {props.left}
              </span>
            )}
            {props.right && (
              <span className="is-right icon">
                {props.right}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Field;
