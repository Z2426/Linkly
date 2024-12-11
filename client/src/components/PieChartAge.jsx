import React from "react";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const RADIAN = Math.PI / 180;
const COLORS = [
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#cb4335",
  "#2874a6",
  "#ae00ff",
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartAge({ age }) {
  const [t] = useTranslation();
  const data = [
    { name: "null", value: 8 },
    { name: "female", value: 15 },
    { name: "male", value: 23 },
    { name: "other", value: 27 },
    { name: "prefer_not_to_say", value: 43 },
  ];

  // const updatedData =
  //   age &&
  //   age.map((item, index) => ({
  //     name: item.ageGroup + "-" + age[index + 1]?.ageGroup ?? "100",
  //     value: item.count,
  //   }));
  const updatedData = age.map((item) => {
    let newAgeGroup;
    if (item.ageGroup === 0) {
      newAgeGroup = "0-18";
    } else if (item.ageGroup === 18) {
      newAgeGroup = "18-25";
    } else if (item.ageGroup === 25) {
      newAgeGroup = "25-35";
    } else if (item.ageGroup === 35) {
      newAgeGroup = "35-45";
    } else if (item.ageGroup === 45) {
      newAgeGroup = "45-55";
    } else {
      newAgeGroup = "Other";
    }
    return { ...item, name: newAgeGroup, value: item.count };
  });

  return (
    <div className="w-[20rem] h-[22rem] bg-ascent-3/10 p-4 rounded-sm flex flex-col">
      <strong className="text-gray-700 font-medium text-ascent-1">
        {t("Age")}
      </strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={300}>
            <Pie
              data={updatedData}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={105}
              fill="#8884d8"
              dataKey="value"
            >
              {age.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
