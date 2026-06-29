import type {
  Recommendation,
  KPI,
  ForecastPoint,
  StoreHealth,
  CategoryBreakdown,
} from "@/types";

export const recommendations: Recommendation[] = [
  {
    id: "rec_01",
    product: "Dipirona Monoidratada 500mg",
    sku: "DPM-500-C20",
    store: "Loja Vila Madalena",
    storeCode: "SP-042",
    qty: 1840,
    unit: "caixas",
    impact: 184_300,
    confidence: 96,
    reason: "Ruptura projetada em 4 dias · venda média 14d acima da meta",
    category: "ruptura",
    urgency: "critical",
    insight:
      "Demanda subiu 38% após pico sazonal de gripes. Estoque atual cobre apenas 3.2 dias contra 14 dias ideais. Fornecedor EMS tem lead time de 2 dias.",
  },
  {
    id: "rec_02",
    product: "Losartana Potássica 50mg",
    sku: "LST-050-C30",
    store: "Loja Pinheiros",
    storeCode: "SP-018",
    qty: 920,
    unit: "caixas",
    impact: 96_400,
    confidence: 92,
    reason: "Top 5 receita · cobertura crítica em 6 lojas",
    category: "ruptura",
    urgency: "critical",
    insight:
      "Medicamento contínuo com taxa de recompra de 84%. Risco de migração do cliente para concorrente local em 7 dias.",
  },
  {
    id: "rec_03",
    product: "Omeprazol 20mg",
    sku: "OMP-020-C28",
    store: "Loja Itaim Bibi",
    storeCode: "SP-007",
    qty: 640,
    unit: "caixas",
    impact: 58_200,
    confidence: 89,
    reason: "Transferir excedente de SP-091 → economia em frete",
    category: "transferencia",
    urgency: "high",
    insight:
      "Loja Moema (SP-091) tem 312 caixas com giro de 1.8x abaixo do esperado. Transferência evita compra nova e libera capital.",
  },
  {
    id: "rec_04",
    product: "Atorvastatina Cálcica 20mg",
    sku: "ATV-020-C30",
    store: "Loja Higienópolis",
    storeCode: "SP-031",
    qty: 480,
    unit: "caixas",
    impact: 42_800,
    confidence: 87,
    reason: "Sazonalidade alta · check-up cardiológico no bairro",
    category: "reposicao",
    urgency: "high",
    insight:
      "Modelo detectou aumento de prescrições no CEP 01238 vinculado a campanhas cardiológicas de duas clínicas parceiras.",
  },
  {
    id: "rec_05",
    product: "Insulina Glargina 100UI/mL",
    sku: "INS-100-R1",
    store: "Loja Brooklin",
    storeCode: "SP-055",
    qty: 220,
    unit: "refis",
    impact: 38_400,
    confidence: 94,
    reason: "Cold chain · pedido único otimiza logística refrigerada",
    category: "reposicao",
    urgency: "high",
    insight:
      "Agrupar com pedido programado de quarta-feira reduz custo logístico de cold chain em R$ 2.140.",
  },
  {
    id: "rec_06",
    product: "Vitamina D3 2000UI",
    sku: "VTD-2K-C60",
    store: "Loja Moema",
    storeCode: "SP-091",
    qty: 1200,
    unit: "frascos",
    impact: 28_900,
    confidence: 81,
    reason: "Promoção sugerida · margem +12% com volume",
    category: "promocao",
    urgency: "medium",
    insight:
      "Cluster demográfico responde bem a combos. Bundle com Vitamina C aumenta ticket médio em 22% segundo histórico.",
  },
  {
    id: "rec_07",
    product: "Anticoncepcional Cerazette",
    sku: "ACT-CRZ-C28",
    store: "Loja Jardins",
    storeCode: "SP-003",
    qty: 360,
    unit: "caixas",
    impact: 24_100,
    confidence: 90,
    reason: "Recorrência mensal · 142 clientes ativas no CRM",
    category: "reposicao",
    urgency: "medium",
    insight:
      "Base de assinaturas mensais identificada via fidelidade. Compra evita rupturas em janela de 5 dias.",
  },
];

export const kpis: KPI[] = [
  {
    label: "Receita Perdida",
    value: "R$ 1,84M",
    delta: "+12.4%",
    trend: "up",
    description:
      "Estimativa em 14 dias por rupturas projetadas em 38 SKUs críticos",
    spark: [12, 18, 15, 24, 22, 30, 28, 34, 32, 40, 38, 46, 52, 58],
    tone: "danger",
  },
  {
    label: "Capital Travado",
    value: "R$ 6,42M",
    delta: "−8.1%",
    trend: "down",
    description:
      "Estoque parado >90 dias em 142 lojas. Liberação alvo de R$ 1.2M no Q4.",
    spark: [70, 68, 72, 65, 60, 62, 58, 55, 52, 50, 48, 46, 44, 42],
    tone: "warning",
  },
  {
    label: "Risco de Vencimento",
    value: "R$ 482k",
    delta: "+3.2%",
    trend: "up",
    description: "204 SKUs vencendo em 60 dias. Realocação automática sugerida.",
    spark: [22, 24, 23, 28, 26, 30, 32, 35, 33, 38, 40, 42, 45, 48],
    tone: "warning",
  },
];

export const forecastData: ForecastPoint[] = Array.from(
  { length: 30 },
  (_, i) => {
    const base = 420 + Math.sin(i / 3) * 80 + i * 6;
    return {
      day: `D${i + 1}`,
      actual: i < 18 ? Math.round(base + (Math.random() - 0.5) * 40) : null,
      forecast: Math.round(base + i * 2),
      upper: Math.round(base + i * 2 + 60),
      lower: Math.round(base + i * 2 - 60),
    };
  }
);

export const storeHeatmap: StoreHealth[] = [
  { code: "SP-042", name: "Vila Madalena", health: 42, revenue: 1.84, risk: "critical" },
  { code: "SP-018", name: "Pinheiros", health: 51, revenue: 1.62, risk: "critical" },
  { code: "SP-007", name: "Itaim Bibi", health: 68, revenue: 2.14, risk: "high" },
  { code: "SP-031", name: "Higienópolis", health: 72, revenue: 1.38, risk: "high" },
  { code: "SP-055", name: "Brooklin", health: 78, revenue: 1.92, risk: "medium" },
  { code: "SP-091", name: "Moema", health: 84, revenue: 2.48, risk: "low" },
  { code: "SP-003", name: "Jardins", health: 88, revenue: 2.81, risk: "low" },
  { code: "SP-022", name: "Perdizes", health: 91, revenue: 1.71, risk: "low" },
  { code: "SP-014", name: "Vila Olímpia", health: 76, revenue: 2.02, risk: "medium" },
  { code: "SP-068", name: "Tatuapé", health: 64, revenue: 1.48, risk: "high" },
  { code: "SP-077", name: "Santana", health: 81, revenue: 1.32, risk: "low" },
  { code: "SP-029", name: "Mooca", health: 58, revenue: 1.21, risk: "high" },
];

export const categoryBreakdown: CategoryBreakdown[] = [
  { name: "Genéricos", value: 38, color: "var(--chart-1)" },
  { name: "Marca", value: 27, color: "var(--chart-2)" },
  { name: "OTC", value: 18, color: "var(--chart-3)" },
  { name: "Perfumaria", value: 12, color: "var(--chart-5)" },
  { name: "Outros", value: 5, color: "var(--chart-4)" },
];
