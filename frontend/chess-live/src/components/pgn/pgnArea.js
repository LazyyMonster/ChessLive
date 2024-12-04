import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";


export default function ChessPGNBreadcrumbs({ moves }) {

  const handleMoveClick = (move, index) => {
    console.log(`Move ${index + 1}: ${move}`);
  };

  return (
    <>
      <h1>PGN</h1>
      <Breadcrumbs className="pgnArea" aria-label="chess moves" separator="">
      {moves.map((move, index) => (
        <Link
          key={index}
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleMoveClick(move, index);
          }}
        >
          {index % 2 === 0 
            ? `${Math.floor(index / 2) + 1}.${move}` 
            :`${move}`
            }
        </Link>
      ))}
      </Breadcrumbs>
    </>
   
  );
}