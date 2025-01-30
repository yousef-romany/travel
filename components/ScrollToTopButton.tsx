"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa6";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Track scroll position and show button when scrolled down
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll the page back to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add event listener on mount and clean up on unmount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
          className="rounded-full text-[2rem]"
        >
          <FaArrowUp size={35} />
        </Button>
      )}
    </>
  );
};

export default ScrollToTopButton;
