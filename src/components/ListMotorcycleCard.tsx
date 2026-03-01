import type { FetchMotorcyclesTypeResponse } from "@/app/logistics/page";
import { Card, CardContent } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface ListMotorcycleProps {
  motorcycles: FetchMotorcyclesTypeResponse[];
}

const ListMotorcycleCard = ({ motorcycles }: ListMotorcycleProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Chassi</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Data de Chegada</TableHead>
              <TableHead>Registrado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {motorcycles?.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <span className="font-mono text-xs">{e.chassis}</span>
                </TableCell>
                <TableCell>{e.model}</TableCell>
                <TableCell>
                  {new Date(e.arrivalDate).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(e.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
export default ListMotorcycleCard;
