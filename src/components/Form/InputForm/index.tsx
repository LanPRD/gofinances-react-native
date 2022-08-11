import { TextInputProps } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { Input } from "../Input";

import { Container, Error } from "./styles";

interface Props extends TextInputProps {
  control: Control;
  name: string;
  error?: FieldErrors;
}

export function InputForm({ control, name, error, ...rest }: Props) {
  return (
    <Container>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => <Input onChangeText={onChange} value={value} {...rest} />}
      />

      {error && <Error>{error}</Error>}
    </Container>
  );
}
