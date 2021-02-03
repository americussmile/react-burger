import React from "react";
import classes from "./BuildControls.module.css";
import BuildControl from "./BuildControl/BuildControl";

const controls = [
  { label: "Salad", type: "salad" },
  { label: "Bacon", type: "bacon" },
  { label: "Cheese", type: "cheese" },
  { label: "Meat", type: "meat" },
];

const buildCotrols = (props) => {
  return (
    <div className={classes.BuildControls}>
      <p>
        Current price: <strong>{props.totalPrice.toFixed(2)}</strong>
      </p>
      {controls.map((ctrl) => {
        return (
          <BuildControl
            key={ctrl.label}
            label={ctrl.label}
            added={() => {
              props.added(ctrl.type);
            }}
            removed={() => {
              props.removed(ctrl.type);
            }}
            amount={props.amounts[ctrl.type]}
            disabled={props.disabled[ctrl.type]}
          />
        );
      })}
      <button
        onClick={props.ordered}
        disabled={!props.purchaseable}
        className={classes.OrderButton}
      >
        ORDER NOW
      </button>
    </div>
  );
};

export default buildCotrols;
