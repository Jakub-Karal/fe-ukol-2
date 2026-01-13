import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

function ItemsChart({ items }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const doneCount = items.filter((i) => i.done).length;
  const notDoneCount = items.length - doneCount;

  const data = [
    { name: t("charts.completed"), value: doneCount },
    { name: t("charts.pending"), value: notDoneCount },
  ];

  const COLORS = [theme.success, theme.warning];

  if (items.length === 0) {
    return (
      <div style={{ padding: 16, textAlign: "center", color: theme.textMuted }}>
        {t("items.noItems")}
      </div>
    );
  }

  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <h3 style={{ marginBottom: 12, color: theme.text, fontSize: 16 }}>
        {t("items.statistics")}
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill={theme.primary}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: theme.background,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              borderRadius: 8,
            }}
            itemStyle={{
              color: theme.text,
            }}
            labelStyle={{
              color: theme.text,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ItemsChart;
