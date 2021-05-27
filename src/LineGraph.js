import React, { useState, useEffect } from "react";
import { LineChart,Line, XAxis, YAxis } from 'recharts';

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
  },
  recovered: {
    hex: "#7dd71d",
  },
  deaths: {
    hex: "#fb4443",
  },
};
const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
        xaxis:new Date(date).toLocaleDateString('en-CA',{year:'2-digit', month:'short'})
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType }) {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
                });
    };

    fetchData();
  }, [casesType]);

  return (
    <div>
      {data?.length > 0 && (
        <LineChart width={300} height={400} data={data}>
        <Line type="monotone" dataKey="y" stroke={casesTypeColors[casesType]['hex']} />
        <XAxis dataKey="xaxis" />
        <YAxis/>
        </LineChart>
      )}
   </div>
  );
}

export default LineGraph;
