"use client";

export default function Loading() {
  return (
    <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-center z-[99999999999999999] bg-background">
      <div className="loader"></div>
    </div>
  );
}
