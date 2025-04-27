import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export function useCurrentUser() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        const idUser = await SecureStore.getItemAsync("currentUser");
        if (!idUser) {
          throw new Error("No user ID found in SecureStore");
        }

        const response = await fetch(`http://192.168.1.16:4000/users/${idUser}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du user");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Erreur dans useCurrentUser:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { userData, isLoading, isError };
}
