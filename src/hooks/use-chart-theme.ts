import { useTheme } from "./use-theme";

/**
 * Paleta dos gráficos, num lugar só. Antes cada página repetia estas seis
 * linhas — mudar a cor de grade exigia editar quatro arquivos.
 */
export function useChartTheme() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return {
    dark,
    gridColor: dark ? "#2A2A2A" : "#E0DDD8",
    tickColor: dark ? "#A0A0A0" : "#6B6B6B",
    tooltipBg: dark ? "#1C1C1C" : "#FFFFFF",
    tooltipBorder: dark ? "#2A2A2A" : "#E0DDD8",
    tooltipColor: dark ? "#FFFFFF" : "#003D2B",
    areaFill: dark ? "rgba(255,138,0,0.15)" : "rgba(255,138,30,0.1)",
    areaFill2: dark ? "rgba(160,160,160,0.1)" : "rgba(100,100,100,0.08)",
    /** props prontas para <Tooltip contentStyle={...}> do recharts */
    tooltipStyle: {
      background: dark ? "#1C1C1C" : "#FFFFFF",
      border: `1px solid ${dark ? "#2A2A2A" : "#E0DDD8"}`,
      borderRadius: 8,
      color: dark ? "#FFFFFF" : "#003D2B",
    },
  };
}
