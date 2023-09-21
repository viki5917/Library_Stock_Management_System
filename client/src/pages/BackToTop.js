import React, { useEffect, useState } from "react";
import "../css/BackToTop.css";

const BackToTop = () => {
  const [backToTopButton, setBackToTopButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setBackToTopButton(true);
      } else {
        setBackToTopButton(false);
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {backToTopButton && (
        <button className="backtotop-btn" onClick={scrollToTop}>
          ^
        </button>
      )}
    </>
  );
};

export default BackToTop;
