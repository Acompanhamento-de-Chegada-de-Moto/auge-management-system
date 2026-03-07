import { XCircle } from "lucide-react";

const ErrorFetchingMotorcycle = () => {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
      <XCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Chassi nao encontrado na logística
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          A moto ainda nao chegou na concessionaria. O cadastro sera feito com
          status &ldquo;Aguardando&rdquo;.
        </p>
      </div>
    </div>
  );
};
export default ErrorFetchingMotorcycle;
