"use client"

import { useGameStore } from "@/store/gameStore"
import { useEffect } from "react";

export const AppInitializer = () => {
    const connect = useGameStore((state) => state.connect);

    useEffect(() => {
        connect();
    }, [connect]);

    return null;
}