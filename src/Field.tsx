import React from "react";
export interface Props {
  label: string
  value: string | number
  onChange: (val: any) => void
  unit?: any
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
          <p className="control has-icons-right">
            <input className="input" type={props.type} value={props.value} onChange={e => props.onChange((e.target as any).value)} />
            {props.unit && (
              <span className="is-right icon">
                {props.unit}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Field;
