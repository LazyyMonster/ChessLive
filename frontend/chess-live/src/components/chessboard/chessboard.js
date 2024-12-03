import { Chessboard } from 'react-chessboard';


export default function CustomChessboard({fen}) {
    return (
        <div className="CustomBoard"> 
            <Chessboard position={fen} boardWidth={500}>
    
            </Chessboard>
    
        </div>
    )
}