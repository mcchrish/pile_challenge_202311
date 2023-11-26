import { Dialog, Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useCallback, useState } from "react";
import { AccountItem, AccountNotSelected } from "./components/account-item";
import {
  useGetBankAccountsQuery,
  useSepaBankTransferMutation,
} from "./services/pile";
import { FormValues, GetBankAccountsQueryParams } from "./types";

const defaultValues = {
  amount: 0,
  recipientName: "",
  targetIban: "",
  targetBic: "",
  reference: "",
};

function App() {
  const [filters, setFilters] = useState<GetBankAccountsQueryParams>({
    min_balance: 0,
    max_balance: 0,
    search: "",
  });
  const { data, isFetching } = useGetBankAccountsQuery(filters);
  const [sepaBankTransfer, results] = useSepaBankTransferMutation();
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();
      if (!values.sourceAccount) {
        setErrorMsg("Source account required");
        return;
      }
      await sepaBankTransfer({
        sourceId: values.sourceAccount.id,
        ...values,
      });
    },
    [sepaBankTransfer, values],
  );

  const reset = useCallback(() => {
    setValues(defaultValues);
    setErrorMsg("");
    results.reset();
  }, [results]);

  return !data ? (
    <div className="animate-pulse flex flex-col gap-2">
      <div className="rounded bg-slate-100 h-20 w-full"></div>
      <div className="rounded bg-slate-100 h-40 w-full"></div>
      <div className="rounded bg-slate-100 h-30 w-full"></div>
    </div>
  ) : (
    <>
      <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl mt-2">Source</h2>
          <span>
            Total Balances:{" "}
            {data.totalBalances.toLocaleString(undefined, {
              style: "currency",
              currency: "EUR",
            })}
          </span>
        </div>
        <div className="flex flex-col gap-2 border rounded-lg p-4">
          <div className="flex flex-col gap-1 border rounded-lg p-2 bg-gray-50">
            <p className="font-medium text-sm">
              Filters{" "}
              {isFetching && (
                <span className="font-normal text-gray-500 text-xs">
                  refreshing
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <label className="flex flex-col gap-1">
                <span className="font-medium text-xs">Search</span>
                <input
                  name="search"
                  className="border border-gray-400 rounded px-2 py-1 w-full"
                  value={filters.search}
                  placeholder="Deutsche Bank / IBAN"
                  onChange={(event) => {
                    setFilters((values) => ({
                      ...values,
                      search: event.target.value,
                    }));
                  }}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-medium text-xs">Min Balance</span>
                <input
                  name="min_balance"
                  className="border border-gray-400 rounded px-2 py-1 w-full"
                  value={filters.min_balance}
                  type="number"
                  step="0.01"
                  onChange={(event) => {
                    setFilters((values) => ({
                      ...values,
                      min_balance:
                        Math.round(Number(event.target.value) * 100) / 100,
                    }));
                  }}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-medium text-xs">Max Balance</span>
                <input
                  name="max_balance"
                  className="border border-gray-400 rounded px-2 py-1 w-full"
                  value={filters.max_balance}
                  type="number"
                  step="0.01"
                  onChange={(event) => {
                    setFilters((values) => ({
                      ...values,
                      max_balance:
                        Math.round(Number(event.target.value) * 100) / 100,
                    }));
                  }}
                />
              </label>
            </div>
          </div>
          <Listbox
            as="div"
            name="sourceAccount"
            aria-required
            className="relative"
            value={values.sourceAccount}
            onChange={(sourceAccount) => {
              setValues((values) => ({ ...values, sourceAccount }));
            }}
          >
            <Listbox.Button className="relative border border-gray-400 rounded px-2 py-1 text-left w-full">
              {values.sourceAccount ? (
                <AccountItem account={values.sourceAccount} />
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
              {data.accounts.map((account) => (
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
              name="amount"
              className="border border-gray-400 rounded px-2 py-1 w-full"
              value={values.amount}
              type="number"
              min="1"
              max={
                values.sourceAccount?.balances.available.value ??
                Number.MAX_VALUE
              }
              step="0.01"
              onChange={(event) => {
                setValues((values) => ({
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
              name="targetIban"
              className="border border-gray-400 rounded px-2 py-1 w-full"
              value={values.targetIban}
              type="text"
              onChange={(event) => {
                setValues((values) => ({
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
              name="targetIban"
              className="border border-gray-400 rounded px-2 py-1 w-full"
              value={values.targetBic}
              type="text"
              onChange={(event) => {
                setValues((values) => ({
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
              name="recipientName"
              className="border border-gray-400 rounded px-2 py-1 w-full"
              value={values.recipientName}
              type="text"
              onChange={(event) => {
                setValues((values) => ({
                  ...values,
                  recipientName: event.target.value,
                }));
              }}
              required
              placeholder="John Appleseed"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Reference</span>
            <input
              name="reference"
              className="border border-gray-400 rounded px-2 py-1 w-full"
              value={values.reference}
              type="text"
              onChange={(event) => {
                setValues((values) => ({
                  ...values,
                  reference: event.target.value,
                }));
              }}
              required
            />
          </label>
        </div>
        <button
          type="submit"
          className="self-end px-4 py-2 bg-blue-700 rounded-lg font-medium text-white"
          onSubmit={onSubmit}
        >
          Transfer
        </button>
        {!!errorMsg && (
          <p
            role="alert"
            className="bg-red-50 rounded-lg text-red-900 px-4 py-2"
          >
            {errorMsg}
          </p>
        )}
      </form>
      <Dialog
        as="div"
        open={!!results.fulfilledTimeStamp}
        className="relative z-10"
        onClose={reset}
      >
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium text-gray-900"
              >
                Transfer successful
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Your transfer was successful!
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900"
                  onClick={reset}
                >
                  Done
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default App;
