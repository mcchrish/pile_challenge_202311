import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useGetBankAccountsQuery } from "./services/pile";
import { BankAccount } from "./types";
import { AccountItem, AccountNotSelected } from "./components/account-item";

function App() {
  const { data, error, isLoading } = useGetBankAccountsQuery("bulbasaur");
  const [formValues, setFormValues] = useState<FormValues>({
    amount: 0,
    recipientName: "",
    targetIban: "",
    targetBic: "",
  });

  useEffect(() => {
    if (data?.data.length) {
      setFormValues((values) => ({ ...values, sourceAccount: data.data[0] }));
    }
  }, [data]);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        console.log(formValues);
      }}
    >
      <h2 className="font-semibold text-xl mt-2">Source</h2>
      <div className="flex flex-col gap-1 border rounded-lg p-4">
        <p className="font-medium" id="source-account-label">
          Account
        </p>
        <Listbox
          as="div"
          aria-labelledby="source-account-label"
          className="relative"
          value={formValues.sourceAccount}
          onChange={(sourceAccount) => {
            setFormValues((values) => ({ ...values, sourceAccount }));
          }}
        >
          <Listbox.Button className="relative border border-gray-400 rounded px-2 py-1 text-left w-full">
            {formValues.sourceAccount ? (
              <AccountItem account={formValues.sourceAccount} />
            ) : (
              <AccountNotSelected />
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute max-h-60 w-full overflow-auto rounded-md py-1 shadow-lg bg-white">
            {data?.data.map((account) => (
              <Listbox.Option
                key={account.id}
                value={account}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-100" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <AccountItem account={account} />
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
      <h2 className="font-semibold text-xl mt-2">Recipient</h2>
      <div className="flex flex-col gap-2 border rounded-lg p-4">
        <label className="flex flex-col gap-1">
          <span className="font-medium">Amount (EUR)</span>
          <input
            className="border border-gray-400 rounded px-2 py-1 w-full"
            value={formValues.amount}
            type="number"
            min="1"
            max={
              formValues.sourceAccount?.balances.available.value ??
              Number.MAX_VALUE
            }
            step="0.01"
            onChange={(event) => {
              setFormValues((values) => ({
                ...values,
                amount: Math.round(Number(event.target.value) * 100) / 100,
              }));
            }}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium">IBAN</span>
          <input
            className="border border-gray-400 rounded px-2 py-1 w-full"
            value={formValues.targetIban}
            type="text"
            onChange={(event) => {
              setFormValues((values) => ({
                ...values,
                targetIban: event.target.value.trim(),
              }));
            }}
            required
            placeholder="DE56530041836982318248"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium">BIC</span>
          <input
            className="border border-gray-400 rounded px-2 py-1 w-full"
            value={formValues.targetIban}
            type="text"
            onChange={(event) => {
              setFormValues((values) => ({
                ...values,
                targetBic: event.target.value.trim(),
              }));
            }}
            required
            placeholder="DEUTDEFFXXX"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Recipient's Name</span>
          <input
            className="border border-gray-400 rounded px-2 py-1 w-full"
            value={formValues.recipientName}
            type="text"
            onChange={(event) => {
              setFormValues((values) => ({
                ...values,
                recipientName: event.target.value.trim(),
              }));
            }}
            required
            placeholder="John Appleseed"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Reference</span>
          <input
            className="border border-gray-400 rounded px-2 py-1 w-full"
            value={formValues.recipientName}
            type="text"
            onChange={(event) => {
              setFormValues((values) => ({
                ...values,
                reference: event.target.value.trim(),
              }));
            }}
            required
          />
        </label>
      </div>
      <button
        type="submit"
        className="self-end px-4 py-2 bg-blue-700 rounded-lg font-medium text-white"
      >
        Transfer
      </button>
    </form>
  );
}

interface FormValues {
  sourceAccount?: BankAccount;
  amount: number;
  recipientName: string;
  targetIban: string;
  targetBic: string;
  reference?: string;
}

export default App;
