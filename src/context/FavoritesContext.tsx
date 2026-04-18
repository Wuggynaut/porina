import {createContext, PropsWithChildren, useCallback, useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext<{
    favorites: Set<string>;
    toggleFavorite: (id: string) => void;
}>(null!);

export function FavoritesProvider({ children }: PropsWithChildren) {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    useEffect(() => {
        AsyncStorage.getItem("favorites").then((raw) => {
            if (raw) setFavorites(new Set(JSON.parse(raw)));
        });
    }, []);

    const toggleFavorite = useCallback((id: string) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            AsyncStorage.setItem("favorites", JSON.stringify([...next]));
            return next;
        })
    }, []);

    return (
        <FavoritesContext.Provider value={{favorites, toggleFavorite}}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);