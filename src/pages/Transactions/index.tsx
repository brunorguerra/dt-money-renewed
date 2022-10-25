import { useContextSelector } from "use-context-selector";
import { Header } from "../../components/Header";
import { Summary } from "../../components/Summary";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { dateFormatter, priceFormatter } from "../../utils/formatter";
import { SearchForm } from "./components/SearchForm";
import {
    PriceHighlight,
    TransactionsContainer,
    TransactionsTable,
} from "./styles";

export const Transactions = () => {
    const transactions = useContextSelector(
        TransactionsContext,
        (context) => context.transactions
    );

    return (
        <>
            <Header />
            <Summary />

            <TransactionsContainer>
                <SearchForm />
                <TransactionsTable>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.description}</td>
                                <PriceHighlight variant={transaction.type}>
                                    {transaction.type === "outcome" && "- "}
                                    {priceFormatter.format(transaction.price)}
                                </PriceHighlight>
                                <td>{transaction.category}</td>
                                <td>
                                    {dateFormatter.format(
                                        new Date(transaction.createdAt)
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </TransactionsTable>
            </TransactionsContainer>
        </>
    );
};
