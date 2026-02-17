import React, { type ReactNode } from "react";

interface CardsProps {
  children: ReactNode;
}

const Cards: React.FC<CardsProps> = ({ children }) => {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center">
      {children}
    </div>
  );
};

export default Cards;