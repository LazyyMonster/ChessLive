import { Chessboard } from 'react-chessboard';


export default function CustomChessboard({fen}) {
    return (
        <div className="CustomBoard"> 
            <h1>Live Position</h1>
            <Chessboard position={fen} boardWidth={500}>
    
            </Chessboard>
    
        </div>
    )
}