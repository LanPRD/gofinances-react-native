import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../../context/Auth";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCardsWrapper,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadingContainer
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  total: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: string;
  lastTransactionInterval: string;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(collection: DataListProps[], type: "positive" | "negative") {
    const collectionFiltered = collection.filter(transaction => transaction.type === type);

    if (collectionFiltered.length === 0) {
      return 0;
    }

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFiltered.map(transaction => new Date(transaction.date).getTime())
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString("pt-BR", { month: "long" })}`;
  }

  async function loadTransaction() {
    const collectionKey = `@gofinance@transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(collectionKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const formattedTransaction: DataListProps[] = transactions.map((item: DataListProps) => {
      if (item.type === "positive") {
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

      const date = Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(
        new Date(item.date)
      );

      return {
        id: item.id,
        title: item.title,
        amount: amount,
        type: item.type,
        category: item.category,
        date: date
      };
    });

    setTransactions(formattedTransaction);

    const lastTransactionEntries = getLastTransactionDate(formattedTransaction, "positive");
    const lastTransactionExpensives = getLastTransactionDate(formattedTransaction, "negative");
    const totalInterval = lastTransactionExpensives === 0 ? "N??o h?? transa????es" : `01 a ${lastTransactionExpensives}`;
    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      expensives: {
        total: expensiveTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        }),
        lastTransaction:
          lastTransactionExpensives === 0 ? "N??o h?? transa????es" : `??ltima entrada dia ${lastTransactionExpensives}`
      },
      entries: {
        total: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        }),
        lastTransaction:
          lastTransactionEntries === 0 ? "N??o h?? transa????es" : `??ltima sa??da dia ${lastTransactionEntries}`
      },
      total: total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      }),
      lastTransactionInterval: totalInterval
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransaction();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransaction();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />

                <User>
                  <UserGreeting>Ol??,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCardsWrapper>
            <HighlightCard
              title="Entradas"
              amount={highlightData.entries.total}
              lastTransaction={highlightData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Sa??das"
              amount={highlightData.expensives.total}
              lastTransaction={highlightData.expensives.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData.total}
              lastTransaction={highlightData.lastTransactionInterval}
              type="total"
            />
          </HighlightCardsWrapper>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
