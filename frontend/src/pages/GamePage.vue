<template>
    <div class="container mx-auto max-w-3xl mt-8 mb-32">
        <h2 class="text-2xl font-bold mb-5 mt-32">Simple Tic Tac Toe</h2>
        <p class="text-lg font-bold mb-5">
            {{ gameStatus }}</p>
        <button @click="resetBoard" v-if="hasWon" type="button" class="mb-5 mr-2 relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Restart Game
              </button>
        <div class="grid grid-cols-3 gap-4">
            <div
            :key="ind"
                v-for="(board,ind) in gameBoard"
                @click="boardClicked(ind)"
                class="bg-gray-200 h-20 text-4xl font-bold flex items-center justify-center">

                <div class="h-28 w-28" v-if="board === 'x'">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M16.9498 8.46447C17.3404 8.07394 17.3404 7.44078 16.9498 7.05025C16.5593 6.65973 15.9261 6.65973 15.5356 7.05025L12.0001 10.5858L8.46455 7.05025C8.07402 6.65973 7.44086 6.65973 7.05033 7.05025C6.65981 7.44078 6.65981 8.07394 7.05033 8.46447L10.5859 12L7.05033 15.5355C6.65981 15.9261 6.65981 16.5592 7.05033 16.9497C7.44086 17.3403 8.07402 17.3403 8.46455 16.9497L12.0001 13.4142L15.5356 16.9497C15.9261 17.3403 16.5593 17.3403 16.9498 16.9497C17.3404 16.5592 17.3404 15.9261 16.9498 15.5355L13.4143 12L16.9498 8.46447Z"
                              fill="#000000" />
                    </svg>
                </div>
                <div class="h-20 w-20" v-else-if="board === 'o'">
                    <svg viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                              fill="#000000" />
                    </svg>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, onMounted, computed } from "vue";

let gameBoard = ref([]);
let currentPlayer = ref("x");
let hasWon = ref(false);
let wonByDraw = ref(false)

function flipTurn() {
    currentPlayer.value = currentPlayer.value === "x" ? "o" : "x";
}

let gameStatus = computed(()=>{
  if(wonByDraw.value) {
    hasWon.value = true;
    return "GAME DRAW PLAY AGAIN"
  }
  if(hasWon.value){
    return "Player " + currentPlayer.value + " has won the game"
  }
  else if(!hasWon.value){
    return "Game Ongoing"
  }
})

function checkWin(board) {
    let isFull = true;
    for(let brd=0;brd < board.length;brd++) {
      console.log(board[brd])
      if(board[brd] === ''){
        isFull = false;
      }
    }
    if(isFull){
      wonByDraw.value = true;
      return true;
    }
    let player = currentPlayer.value;
    for (let i = 0; i < 9; i += 3) {
        if (board[i] === player && board[i + 1] === player && board[i + 2] === player) {
            return true;
        }
    }
    for (let j = 0; j < 3; j++) {
        if (board[j] === player && board[j + 3] === player && board[j + 6] === player) {
            return true;
        }
    }
    if (board[0] === player && board[4] === player && board[8] === player) {
        return true;
    }
    if (board[2] === player && board[4] === player && board[6] === player) {
        return true;
    }
    return false;
}

function resetBoard() {
    hasWon.value = false;
    wonByDraw.value = false;
    let tempArr = new Array(9);
    tempArr.fill("");
    gameBoard.value.splice(0);
    gameBoard.value = tempArr;
    currentPlayer.value = "x";
}

function boardClicked(ind) {
    if (hasWon.value) {
        return;
    }
    gameBoard.value[ind] = currentPlayer.value;
    if (checkWin(gameBoard.value)) {
        hasWon.value = true;
    }
    else {
      flipTurn();
    }


}

onMounted(() => {
    resetBoard();
});


</script>