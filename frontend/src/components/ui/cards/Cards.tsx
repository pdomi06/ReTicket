import React, { type ReactNode } from "react";


interface CardsProps {
  children: ReactNode;
  maximumcols?: number;
}


const Cards: React.FC<CardsProps> = ({ children, maximumcols = 4 }) => {
  // row-cols-lg-{maximumcols} dynamic
  const rowColsLgClass = `row-cols-lg-${maximumcols}`;
  const rowColsMdClass = `row-cols-md-${Math.min(maximumcols, 3)}`; // Limit to 3 columns on medium screens
  const rowColsSmClass = `row-cols-sm-${Math.min(maximumcols, 2)}`; // Limit to 2 columns on small screens
  return (
    <div className={`row row-cols-1 ${rowColsSmClass} ${rowColsMdClass} ${rowColsLgClass} g-4 justify-content-center`}>
      {children}
    </div>
  );
};

export default Cards;