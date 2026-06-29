export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const formatCurrencyCompact = (value: number): string => {
  if (value >= 1_000_000)
    return `R$ ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000)
    return `R$ ${(value / 1_000).toFixed(0)}k`;
  return formatCurrency(value);
};

export const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("pt-BR").format(new Date(dateString));

export const getDaysUntilExpiration = (expirationDate: string) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatConfidence = (score: number) =>
  `${(score * 100).toFixed(0)}%`;
