import { createStackNavigator } from "@react-navigation/stack";

import { SignIn } from "../screens/SignIn";

const { Navigator, Screen } = createStackNavigator();

export function PublicRoutes() {
  return (
    <Navigator>
      <Screen name="SignIn" component={SignIn} options={{ headerShown: false }}></Screen>
    </Navigator>
  );
}
