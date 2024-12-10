import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useChess } from '../../chessLogic/chessGame';


export default function ChessPGNBreadcrumbs() {

  const { getPgn } = useChess();

  const handleMoveClick = (move, index) => {
    console.log(`Move ${index + 1}: ${move}`);
  };

  const moves = getPgn().split(" ").filter(Boolean); // Filter out any empty strings


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