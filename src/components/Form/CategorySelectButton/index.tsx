import { TouchableOpacityProps } from "react-native";

import { Category, Container, Icon } from "./style";

interface Props extends TouchableOpacityProps {
  title: string;
}

export function CategorySelectButton({ title, ...rest }: Props) {
  return (
    <Container {...rest}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}
