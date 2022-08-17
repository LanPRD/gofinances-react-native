import { SvgProps } from "react-native-svg";

import { ButtonLabel, ImageContainer, SignInSocialButtonContainer } from "./styles";

interface SignInSocialButtonContainerProps {
  title: string;
  svg: React.FC<SvgProps>;
  onPress: () => void;
}

export function SignInSocialButton({ title, svg: Svg, ...rest }: SignInSocialButtonContainerProps) {
  return (
    <SignInSocialButtonContainer {...rest}>
      <ImageContainer>
        <Svg />
      </ImageContainer>

      <ButtonLabel>{title}</ButtonLabel>
    </SignInSocialButtonContainer>
  );
}
