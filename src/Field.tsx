import React from "react";
export interface Props {
  label: string
  value: string | number
  onChange: (val: any) => void
  right?: any
  left?: any
  type: string
}
const Field = (props: Props) => {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{props.label}</label>
      </div>
      <div className="field-body">
        <div className="field">
          <p className={`control ${props.right ? 'has-icons-right' : ''} ${props.left ? 'has-icons-left' : ''}`}>
            <input className="input" type={props.type} value={props.value} onChange={e => props.onChange((e.target as any).value)} />
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
          </p>
        </div>
      </div>
    </div>
  );
};

export default Field;
