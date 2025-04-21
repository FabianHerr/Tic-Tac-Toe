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

    //Reset board
    function resetBoard(){
        let j = 0
        for(let i = 0 ; i < 9 ; i++){
            board[j%3][i%3].setState(0);
            if((i+1)%3 == 0){j++;} // j increases once every 3 iterations
        }
    }

    //Each cell's state
    function Cell(){
        let state = 0;
        const getState = ()=> state ;

        const setState =  (token)=> {
            state = token;
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

    return {chooseCell,checkWinner,resetBoard};
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
            div.setAttribute('data-row', j%3);
            div.setAttribute('data-col', i%3);
            container.appendChild(div);
            if((i+1)%3 == 0){j++;} // j increases once every 3 iterations
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

    function resetDisplay(){
        let j = 0;
        for(let i = 0 ; i < 9 ; i++){
            const element = document.querySelector(`[data-row="${j%3}"][data-col="${i%3}"]`);
            element.textContent = '';
            if((i+1)%3 == 0){j++;} // j increases once every 3 iterations
    }
    }

   
    let p1_name;
    let p2_name;

    function showGameStartPopup() {
        const form = document.querySelector('form');
        // Create backdrop to block user from continue playing
        const backdrop = document.createElement("div");
        backdrop.classList.add("popup-backdrop");
        document.body.appendChild(backdrop);

        // Create Popup
        const popup = document.createElement("div");
        popup.classList.add("game-start-popup");
        const container = document.querySelector(".container");
        container.style.position = "relative";
        document.body.appendChild(popup);
        popup.appendChild(form);

        //Close popup button
        form.addEventListener("submit", (event)=>{
            event.preventDefault(); 
            //Reads data after input 
            const data = new FormData(form);
            p1_name = data.get('Player1_Name');
            p2_name = data.get('Player2_Name');
            popup.remove();
            backdrop.remove();
        });
    }

    function showWinnerPopup(winner) {
        // Create backdrop to block user from continue playing
        const backdrop = document.createElement("div");
        backdrop.classList.add("popup-backdrop");
        document.body.appendChild(backdrop);
        //Create popup
        const popup = document.createElement("div");
        popup.classList.add("winner-popup");
        popup.textContent = `${winner === 1 ? p1_name + ' (X)' : p2_name + ' (O)'} wins!`;
        document.body.appendChild(popup);

        // Create restart button
        const restartBtn = document.createElement("button");
        restartBtn.classList.add("restart-button");
        restartBtn.textContent = "Play Again";
        restartBtn.addEventListener("click", ()=>{
            board.resetBoard();
            resetDisplay();
            popup.remove();
            backdrop.remove();
        });
        popup.appendChild(restartBtn);
    }

    showGameStartPopup();
    displayBoard();


}

Game();
