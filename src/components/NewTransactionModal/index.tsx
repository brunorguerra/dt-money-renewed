import * as Dialog from "@radix-ui/react-alert-dialog";
import * as zod from "zod";

import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import {
    Overlay,
    Content,
    CloseButton,
    TransactionType,
    TransactionTypeButton,
} from "./styles";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { useContextSelector } from "use-context-selector";

const newTransactionFormSchema = zod.object({
    description: zod.string(),
    price: zod.number(),
    category: zod.string(),
    type: zod.enum(["income", "outcome"]),
});

type NewTransactionFormInputs = zod.infer<typeof newTransactionFormSchema>;

export const NewTransactionModal = () => {
    const createTransaction = useContextSelector(
        TransactionsContext,
        (context) => context.createTransaction
    );

    const {
        control,
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset,
    } = useForm<NewTransactionFormInputs>({
        resolver: zodResolver(newTransactionFormSchema),
        defaultValues: {
            type: "income",
        },
    });

    async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
        createTransaction(data);

        reset();
    }

    return (
        <Dialog.Portal>
            <Overlay />

            <Content>
                <Dialog.Title>Nova transação</Dialog.Title>
                <CloseButton>
                    <X size={24} />
                </CloseButton>

                <form
                    action=""
                    onSubmit={handleSubmit(handleCreateNewTransaction)}
                >
                    <input
                        type="text"
                        placeholder="Descrição"
                        required
                        {...register("description")}
                    />
                    <input
                        type="number"
                        placeholder="Preço"
                        required
                        {...register("price", { valueAsNumber: true })}
                    />
                    <input
                        type="text"
                        placeholder="Categoria"
                        required
                        {...register("category")}
                    />

                    <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <TransactionType
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <TransactionTypeButton
                                    variant="income"
                                    value="income"
                                >
                                    <ArrowCircleUp size={24} />
                                    Entrada
                                </TransactionTypeButton>

                                <TransactionTypeButton
                                    variant="outcome"
                                    value="outcome"
                                >
                                    <ArrowCircleDown size={24} />
                                    Saída
                                </TransactionTypeButton>
                            </TransactionType>
                        )}
                    />

                    <button type="submit" disabled={isSubmitting}>
                        Cadastrar
                    </button>
                </form>
            </Content>
        </Dialog.Portal>
    );
};
