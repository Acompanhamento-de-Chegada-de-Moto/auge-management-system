export const REGISTRATION_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  REGISTERED: "Registrado",
  CANCELED: "Cancelado",
};

export const ARRIVAL_STATUS_LABELS: Record<string, string> = {
  WAITING: "Aguardando",
  ARRIVED: "Na Loja",
  DELIVERED: "Entregue",
};

export const getRegistrationStatusColor = (status: string) => {
  switch (status) {
    case "REGISTERED":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case "CANCELED":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  }
};

export const getArrivalStatusColor = (status: string) => {
  switch (status) {
    case "ARRIVED":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "DELIVERED":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
};

export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  try {
    // If it's a YYYY-MM-DD string, parse it manually to avoid UTC shift
    if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
    }
    return new Date(dateStr).toLocaleDateString("pt-BR");
  } catch {
    return "-";
  }
};
