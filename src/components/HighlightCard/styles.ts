import styled, { css } from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

interface CardProps {
  type: "up" | "down" | "total";
}

export const Container = styled.View<CardProps>`
  background-color: ${({ theme, type }) => (type === "total" ? theme.colors.secondary : theme.colors.shape)};

  width: ${RFValue(300)}px;

  border-radius: 4px;

  padding: 20px 24px ${RFValue(42)}px;
  margin-right: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const Title = styled.Text<CardProps>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme, type }) => (type === "total" ? theme.colors.shape : theme.colors.text_dark)};
`;

export const Icon = styled(Feather)<CardProps>`
  font-size: ${RFValue(40)}px;

  ${({ type }) =>
    type === "up" &&
    css`
      color: ${({ theme }) => theme.colors.success};
    `}

  ${({ type }) =>
    type === "down" &&
    css`
      color: ${({ theme }) => theme.colors.attention};
    `}


  ${({ type }) =>
    type === "total" &&
    css`
      color: ${({ theme }) => theme.colors.shape};
    `}
`;

export const Footer = styled.View``;

export const Amount = styled.Text<CardProps>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(32)}px;
  color: ${({ theme, type }) => (type === "total" ? theme.colors.shape : theme.colors.text_dark)};

  margin-top: 38px;
`;

export const LastTransaction = styled.Text<CardProps>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${({ theme, type }) => (type === "total" ? theme.colors.shape : theme.colors.text)};
`;
