//GameBoard module
function GameBoard(){
     const board = [];
     

    //Create 2d board
    for ( let i = 0; i < 3; i++){
        board[i] = [];
        for( let j = 0; j < 3 ; j++ ){
            board[i][j] = Cell();
        }
    }

    //Player chooses cell if available
    function chooseCell(row, column){
        const cell = board[row][column];
        if (cell.getState() === 0){
            const token = curPlayer.token; // capture current player
            cell.setState(token);
            printGameBoard();
            if(checkWinner()) { 
                return token; // return winner's token
            }
            switchPlayer();
            return token; // return current player's token so UI updates
        }
        else {
            return 0; // 0 meaning invalid cell
        }
    }

    //Each cell's state
    function Cell(){
        let state = 0;
        const getState = ()=> state ;

        const setState =  (player_token)=> {
            state = player_token;
        }
        return{getState, setState};
    }

    //Setting up players
    let players= [
        {
        name: 'Player 1' ,
        token : 1 
        },
        {
        name : 'Player 2' ,
        token : 2 
        }
    ];

    let curPlayer = players[0];

    //Switch players turn
    function switchPlayer(){
        curPlayer = curPlayer === players[0] ? players[1]: players[0] ; 
    }
     
    function printGameBoard(){
        let gbwv = board.map(row => row.map(cell => cell.getState())); // Game board with values
        console.log(gbwv);
    }

    //Winning Conditions
    
   //Winning check
   function checkWinner(){
        let gbwv = board.map(row => row.map(cell => cell.getState()));// Game board with values

            for (let i = 0; i < 3; i++) {
                if(gbwv[0][i] == gbwv[1][i] && gbwv[1][i] == gbwv[2][i] && gbwv[0][i] != 0){return true;} // Winning column
                if(gbwv[i][0] == gbwv[i][1] && gbwv[i][1] == gbwv[i][2] && gbwv[i][0] != 0){return true;} // Winning row
            }

            //Winning diagonals
            if(gbwv[0][0] == gbwv[1][1] && gbwv[1][1] == gbwv[2][2] && gbwv[0][0] != 0){return true;}  
            if(gbwv[2][0] == gbwv[1][1] && gbwv[1][1] == gbwv[0][2] && gbwv[2][0] != 0){return true;} 
            
            return false;
    }

    return {chooseCell,checkWinner};
}

//Game functionality
function Game(){
    let board = GameBoard();

    function displayBoard(){
        let gameState;
        const container = document.querySelector(".container");
        let j = 0;
        for(let i = 0 ; i < 9 ; i++){
            const div = document.createElement("div");
            div.classList.add("board");
            div.setAttribute('data-row', i%3);
            div.setAttribute('data-col', j%3);
            container.appendChild(div);
            if(i%3 == 0){j++;} // j increases once every 3 iterations
            div.addEventListener("click", ()=>{
                gameState = board.chooseCell(parseInt(div.dataset.row), parseInt(div.dataset.col));
                if (board.checkWinner()){
                    console.log("WINNER DETECTED:", gameState);
                    showWinnerPopup(gameState);
                }
                if (gameState == 1){
                    div.textContent = "X";
                }
                if(gameState == 2){
                    div.textContent = "O";
                }
            })
        }
    }
    displayBoard();

    function showWinnerPopup(winner) {
        const popup = document.createElement("div");
        popup.textContent = `${winner === 1 ? "Player 1 (X)" : "Player 2 (O)"} wins!`;
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.padding = "20px";
        popup.style.backgroundColor = "white";
        popup.style.border = "2px solid black";
        popup.style.fontSize = "24px";
        popup.style.zIndex = "1000";
        document.body.appendChild(popup);
    }

}

Game();
