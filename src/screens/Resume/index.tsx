import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HistoryCard } from "../../components/HistoryCard";

import { categories } from "../../utils/categories";

import {
  Header,
  ResumeContainer,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  SelectMonthIcon,
  Month,
  LoadingContainer
} from "./styles";

export interface TransactionData {
  type: "positive" | "negative";
  title: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: string;
  totalInNumber: number;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useTheme();

  function handleChangeDate(action: "next" | "prev") {
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);

    const collectionKey = "@gofinance@transactions";

    const response = await AsyncStorage.getItem(collectionKey);
    const dataFormatted: TransactionData[] = response ? JSON.parse(response) : [];

    const expensives = dataFormatted.filter(
      expensive =>
        expensive.type === "negative" &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensiveTotal = expensives.reduce((acumullator: number, expensive: TransactionData) => {
      return acumullator + Number(expensive.amount);
    }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach(expensive => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum === 0) return;

      const percent = `${((categorySum / expensiveTotal) * 100).toFixed(0)}%`;

      totalByCategory.push({
        key: category.key,
        name: category.name,
        color: category.color,
        total: categorySum.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        totalInNumber: categorySum,
        percent: percent
      });
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <ResumeContainer>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: useBottomTabBarHeight() }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate("prev")}>
              <SelectMonthIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>{format(selectedDate, "MMMM, yyyy", { locale: ptBR })}</Month>

            <MonthSelectButton onPress={() => handleChangeDate("next")}>
              <SelectMonthIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x="percent"
              y="totalInNumber"
              colorScale={totalByCategories.map(category => category.color)}
              style={{
                labels: { fontSize: RFValue(18), fontWeight: "bold", fill: theme.colors.shape }
              }}
              labelRadius={50}
            />
          </ChartContainer>

          {totalByCategories.map(item => (
            <HistoryCard key={item.key} color={item.color} title={item.name} amount={item.total} />
          ))}
        </Content>
      )}
    </ResumeContainer>
  );
}
