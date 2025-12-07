"use client";
import { useEffect } from "react";
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";

export default function HieroglyphEffect() {
    useEffect(() => {
        applyHieroglyphEffect();
    }, []);
    return null;
}
