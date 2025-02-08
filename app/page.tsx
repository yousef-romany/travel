"use client"
import applyHieroglyphEffect from "@/utils/applyHieroglyphEffect";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    applyHieroglyphEffect()
  }, [])
  return (
    <div>
      <h1 role="heading"  className="">home screen</h1>
      <h2 role="heading"  className="">home screen</h2>
      <h3 role="heading"  className="">home screen</h3>
      <h4 role="heading"  className="">home screen</h4>
      <h5 role="heading"  className="">home screen</h5>
      <h6 role="heading"  className="">home screen</h6>
      <h1 role="heading"  className="">home screen</h1>
    </div>
  );
}
