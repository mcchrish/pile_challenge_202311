import { BankAccount } from "../types";

interface Props {
  account: BankAccount;
}
export function AccountItem({ account }: Props) {
  return (
    <p>
      <span className="text-sm">{account.IBAN}</span>{" "}
      <span className="text-xs text-gray-600">({account?.name})</span>
      <span className="block text-xs text-gray-600">
        {account.balances.available.value.toLocaleString(undefined, {
          style: "currency",
          currency: account.balances.available.currency,
        })}
      </span>
    </p>
  );
}

export function AccountNotSelected() {
  return (
    <p>
      <span>Please select an account</span>
      <span className="block text-xs text-gray-600">No account selected</span>
    </p>
  );
}
