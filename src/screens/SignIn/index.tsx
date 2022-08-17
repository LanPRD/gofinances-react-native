import { useState } from "react";
import { useTheme } from "styled-components";
import { ActivityIndicator, Alert, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import { useAuth } from "../../context/Auth";

import { SignInSocialButton } from "../../components/SignInSocialButton";

import GoogleSvg from "../../assets/google.svg";
import AppleSvg from "../../assets/apple.svg";
import LogoSvg from "../../assets/logo.svg";

import { Footer, FooterWrapper, Header, SignInContainer, SignInTitle, Title, TitleWrapper } from "./styles";

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();
  const theme = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert("Oops!", "Não foi possível conectar a conta Google");
      setIsLoading(false);
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert("Oops!", "Não foi possível conectar a conta Apple");
      setIsLoading(false);
    }
  }

  return (
    <SignInContainer>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>
            Controle suas {"\n"}
            finanças de forma {"\n"} muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>Faça seu login com {"\n"} uma das contas abaixo</SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton title="Entrar com Google" svg={GoogleSvg} onPress={handleSignInWithGoogle} />
          {Platform.OS === "ios" && (
            <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} onPress={handleSignInWithApple} />
          )}
        </FooterWrapper>

        {isLoading && <ActivityIndicator color={theme.colors.shape} size={24} style={{ marginTop: 16 }} />}
      </Footer>
    </SignInContainer>
  );
}
