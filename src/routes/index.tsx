import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context/Auth";

import { PrivateRoutes } from "./private.routes";
import { PublicRoutes } from "./public.routes";

export function AppRoutes() {
  const { user } = useAuth();

  return <NavigationContainer>{user ? <PrivateRoutes /> : <PublicRoutes />}</NavigationContainer>;
}
