import { Chessboard } from 'react-chessboard';



function CustomChessboard({fen}) {
    return (
        <div className="CustomBoard"> 
            <Chessboard position={fen} boardWidth={500}>
    
            </Chessboard>
    
        </div>
    )
}

export default CustomChessboard;
