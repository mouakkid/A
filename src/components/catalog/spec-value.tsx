import type { CellValue } from "@/lib/catalog/compare";
import { Check, Minus } from "lucide-react";

export function SpecValue({ cell }: { cell: CellValue }) {
  switch (cell.kind) {
    case "unknown":
      return <span className="text-xs font-medium text-warning">Non vérifié</span>;
    case "bool":
      return cell.value ? (
        <span className="inline-flex items-center gap-1 text-success"><Check className="size-4" aria-hidden />Oui</span>
      ) : (
        <span className="inline-flex items-center gap-1 text-fg-subtle"><Minus className="size-4" aria-hidden />Non</span>
      );
    case "text":
      return <span>{cell.value}</span>;
    case "list":
      return <span>{cell.value.join(", ")}</span>;
    case "battery":
      return (
        <ul className="space-y-0.5">
          {cell.value.map((b) => (
            <li key={b.mode}><span className="text-fg-muted">{b.mode} :</span> {b.claim}</li>
          ))}
        </ul>
      );
    case "price":
      return (
        <span>
          {cell.value.amount.toLocaleString("fr-MA")} {cell.value.currency} <span className="text-xs text-fg-subtle">({cell.value.market}{cell.value.note ? ` — ${cell.value.note}` : ""})</span>
        </span>
      );
  }
}
