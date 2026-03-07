import { CheckCircle2 } from "lucide-react";

interface SuccessFetchingMotorcycleProps {
  model: string;
  arrivalDate: string;
}

const SuccessFetchingMotorcycle = ({
  model,
  arrivalDate,
}: SuccessFetchingMotorcycleProps) => {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3">
      <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-emerald-800">
          Moto encontrada na logística
        </p>
        <p className="text-xs text-emerald-700">
          Modelo: <strong>{model}</strong> | Chegou em:{" "}
          <strong>{new Date(arrivalDate).toLocaleDateString("pt-BR")}</strong>
        </p>
      </div>
    </div>
  );
};
export default SuccessFetchingMotorcycle;
