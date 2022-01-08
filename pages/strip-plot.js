import * as React from "react";
import * as Plot from "@observablehq/plot";
import * as fs from "fs";
import * as path from "path";
import * as d3 from "d3";

const StripPlot = ({ data: { states, columns } }) => {
  const root = React.useRef(null);
  const ages = columns.slice(1);
  const stateages = ages.flatMap((age) =>
    states.map((d) => ({ state: d.name, age, population: d[age] }))
  ); // pivot

  React.useEffect(() => {
    const node = root.current;

    const plot = Plot.plot({
      marginLeft: 50,
      grid: true,
      x: {
        axis: "top",
        label: "Percent (%) →",
        transform: (d) => d * 100,
      },
      y: {
        domain: ages,
        label: "Age",
      },
      marks: [
        Plot.ruleX([0]),
        Plot.tickX(
          stateages,
          Plot.normalizeX({
            basis: "sum",
            z: "state",
            x: "population",
            y: "age",
          })
        ),
      ],
    });

    node.appendChild(plot);

    return () => {
      node.removeChild(plot);
    };
  }, [ages, stateages]);

  return <div ref={root} />;
};

export async function getStaticProps() {
  const stateage = fs.readFileSync(
    path.join(process.cwd(), "data/us-population-state-age.csv")
  );
  const data = d3.csvParse(stateage.toString());

  return {
    props: {
      data: {
        states: data,
        columns: data.columns,
      },
    },
  };
}

export default StripPlot;
