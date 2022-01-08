import * as React from "react";
import * as Plot from "@observablehq/plot";

const data = new Array(1000).fill().map(() => Math.floor(Math.random() * 100));

export default function Histogram() {
  const root = React.useRef(null);

  React.useEffect(() => {
    const node = root.current;

    const plot = Plot.plot({
      x: {
        label: "Number",
      },
      y: {
        label: "Frequency",
        grid: true,
      },
      marks: [
        Plot.rectY(data, {
          ...Plot.binX({ y: "count", thresholds: 100 }, { x: (d) => d }),
          fill: "steelblue",
        }),
        Plot.ruleX([0]),
      ],
    });

    node.appendChild(plot);

    return () => {
      node.removeChild(plot);
    };
  }, []);

  return <div ref={root} />;
}
