import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

function ListsChart({ lists }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Připravit data pro graf - pouze aktivní seznamy
  const data = lists
    .filter((list) => !list.archived)
    .map((list) => {
      const itemsCount = list.items?.length || 0;
      const doneCount = list.items?.filter((i) => i.done).length || 0;
      const pendingCount = itemsCount - doneCount;

      return {
        name: list.name.length > 15 ? list.name.substring(0, 15) + "..." : list.name,
        [t("charts.completed")]: doneCount,
        [t("charts.pending")]: pendingCount,
      };
    })
    .slice(0, 5); // Max 5 seznamů pro přehlednost

  if (data.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <h3 style={{ marginBottom: 12, color: theme.text, fontSize: 16 }}>
        {t("charts.itemsStatistics")}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
          <XAxis
            dataKey="name"
            stroke={theme.text}
            tick={{ fill: theme.text, fontSize: 12 }}
          />
          <YAxis
            stroke={theme.text}
            tick={{ fill: theme.text, fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: theme.background,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              borderRadius: 8,
            }}
          />
          <Legend
            wrapperStyle={{
              color: theme.text,
            }}
          />
          <Bar dataKey={t("charts.completed")} fill={theme.success} />
          <Bar dataKey={t("charts.pending")} fill={theme.warning} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ListsChart;
