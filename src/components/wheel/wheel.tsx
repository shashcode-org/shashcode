import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./wheel.css";

type WheelProps = {
  items: string[];
  onFinish: (item: string) => void;
};

export type WheelHandle = {
  spin: () => void;
};

const Wheel = forwardRef<WheelHandle, WheelProps>(
  ({ items, onFinish }, ref) => {
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    const spin = () => {
      if (selectedItem !== null) return;

      const index = Math.floor(Math.random() * items.length);
      setSelectedItem(index);

      setTimeout(() => {
        onFinish(items[index]);
      }, 4000);
    };

    useImperativeHandle(ref, () => ({
      spin,
    }));

    const wheelVars = {
      "--nb-item": items.length,
      "--selected-item": selectedItem ?? 0,
    } as React.CSSProperties;

    return (
      <div className="wheel-container">
        <div
          className={`wheel ${selectedItem !== null ? "spinning" : ""}`}
          style={wheelVars}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="wheel-item"
              style={{ ["--item-nb" as any]: index }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default Wheel;
