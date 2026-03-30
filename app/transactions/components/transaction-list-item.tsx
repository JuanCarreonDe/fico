interface Props {
  item: {
    account_name: string;
    amount: number;
    category_name: string;
    description: string;
    id: string;
    transaction_date: string;
    type: "income" | "expense";
  };
}

export default function TransactionListItem({ item }: Props) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-card rounded-md">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="px-2 py-1 bg-secondary rounded-2xl">
            {item.category_name}
          </span>
          <span className="capitalize">{item.type}</span>
        </div>
        <span
          className={`justify-end ${item.type === "income" ? "text-success" : "text-destructive"}`}
        >
          ${item.amount}
        </span>
      </div>
      {item.description && (
        <p className="text-muted-foreground capitalize">{item.description}</p>
      )}
    </div>
  );
}
