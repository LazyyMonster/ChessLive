import { Chessboard } from 'react-chessboard';
import { useChess } from '../../chessLogic/chessGame';


export default function CustomChessboard({fen}) {

    const { getFen } = useChess();
    // console.log(getFen())
    // // const fen = getFen();

    return (
        <div className="CustomBoard"> 
            <h1>Live Position</h1>
            <Chessboard position={getFen()} boardWidth={500}>
    
            </Chessboard>
    
        </div>
    )
}