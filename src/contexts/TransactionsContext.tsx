import { ReactNode, useCallback, useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface TransactionsProviderProps {
    children: ReactNode;
}

type Transaction = {
    id: number;
    description: string;
    type: "income" | "outcome";
    price: number;
    category: string;
    createdAt: string;
};

interface CreateTransactionProps {
    description: string;
    type: "income" | "outcome";
    price: number;
    category: string;
}

interface TransactionsContextData {
    transactions: Transaction[];
    fetchTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransactionProps) => Promise<void>;
}

export const TransactionsContext = createContext({} as TransactionsContextData);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchTransactions = useCallback(async (query?: string) => {
        const { data } = await api.get("/transactions", {
            params: {
                _sort: "createdAt",
                _order: "desc",
                q: query,
            },
        });

        setTransactions(data);
    }, []);

    const createTransaction = useCallback(
        async (data: CreateTransactionProps) => {
            const { description, price, category, type } = data;

            const response = await api.post("transactions", {
                description,
                price,
                category,
                type,
                createdAt: new Date(),
            });

            setTransactions((lastTransactions) => [
                response.data,
                ...lastTransactions,
            ]);
        },
        []
    );

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <TransactionsContext.Provider
            value={{ transactions, fetchTransactions, createTransaction }}
        >
            {children}
        </TransactionsContext.Provider>
    );
}
