/* eslint-disable react/prop-types */

// import PropTypes from "prop-types";
// import { PropTypes } from "react";
import "./chart.css";
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Chart({ title, data = {}, dataKey, grid }) {
  return (
    <div className="chart">
      <h3 className="chartTitle">{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#5550bd" />
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
// Chart.defaultProps = {
//   title: "",
//   data: [],
//   dataKey: "",
//   grid: "",
// };
// Chart.propTypes = {
//   title: PropTypes.string,
//   data: PropTypes.arrayOf(PropTypes.object()),
//   dataKey: PropTypes.string,
//   grid: PropTypes.string,
// };

export default Chart;
