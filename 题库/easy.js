








function isValid(board, row, col, num) {
    // Check if the number is already in the row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }

    // Check if the number is already in the column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }

    // Check if the number is already in the 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num) {
          return false;
        } 
      }
    }

    // If the number is not in the row, column, or 3x3 box, it's valid
    return true;
  }

  function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        // If the current cell isn't empty, continue to the next cell
        if (board[row][col] !== 0) {
          continue;
        }

        // Try all possible numbers for the current cell
        for (let num = 1; num <= 9; num++) {
          // Check if the number is valid for the current cell
          if (isValid(board, row, col, num)) {
            // Fill in the number and recursively solve the rest of the puzzle
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            // If we couldn't solve the puzzle with this number, backtrack and try the next one
            board[row][col] = 0;
          }
        }

        // If none of the numbers worked, backtrack to the previous cell
        return false;
      }
    }

    // If we've filled in every cell, the puzzle is solved
    return true;
  }

  let board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  let board_test = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ];
  let n1=n2=n3=n4=n5=n6=0
  let spanArr=new Array(81)
  let target=[]
  let boardNote=[[],[],[],[],[],[],[],[],[]]
  let boardNote2=[[],[],[],[],[],[],[],[],[]]
  let action=[]
  let isNote=false
  let isClear=false
  let isHasNote=false
  // 是否融合笔记数组
  let isFirst=false
  
  // 记录数组初始值
  function record(){
    for(let i=0;i<9;i++)
    {
      for(let j=0;j<9;j++)
      {
        if(board[i][j]==0){
          board_test[i][j]=false
        }
        else{
          board_test[i][j]=true
        }
      }
    }
  }
  // 增加新值
  function add(row,col,num){
    board[row][col]=Number(num)
  }
  // 删除旧值
  function remove(row,col){
    board[row][col]=0
  }
  // 检测是否合法
  function test(row, col, num) {
      // 检查行是否合法
      for (let i = 0; i < 9; i++) {
        if (board[row][i] == num) {
          return false;
        }
      }
      // 检查列是否合法
      for (let i = 0; i < 9; i++) {
        if (board[i][col] == num) {
          return false;
        }
      }
      // 检查九宫格是否合法
      const boxRowStart = Math.floor(row / 3) * 3;
      const boxColStart = Math.floor(col / 3) * 3;
      for (let i = boxRowStart; i < boxRowStart + 3; i++) {
        for (let j = boxColStart; j < boxColStart + 3; j++) {
          if (board[i][j] == num) {
            return false;
          }
        }
      }
      return true;
    }


  function randomNum() {
    let random = Math.random() * 10
    if (Math.floor(random) != 0) {
      return Math.floor(random)
    }
    return Math.ceil(random)
  }
  function random() {
    let t = randomNum()
    for (let i = 0; i < 9; i++) {
      if (test(t)) {
        board[0][i] = t
      }

    }
    function test(num) {
      for (let i = 0; i < 9; i++) {
        if (board[0][i] == num) return false
      }
      return true
    }
  }


  function dig() {
    for (let i = 0; i < 9; i++) {
      board[i][randomNum()] = 0
      board[i][randomNum()] = 0
      board[i][randomNum()] = 0
      board[i][randomNum()] = 0
      board[i][randomNum()] = 0
      board[i][randomNum()] = 0

      
    }
  }
  // 容易
  function dig1() {
    while(getVoid(board)<40){
      let row=randomNum()-1
      let col=randomNum()-1
      board[row][col]=0
    }
  }
  // 中等
  function dig2() {
    while(getVoid(board)<50){
      let row=randomNum()-1
      let col=randomNum()-1
      board[row][col]=0
    }
  }
  // 困难
  function dig3() {
    let row,col
    while(getVoid(board)<40){
      row=randomNum()-1
      col=randomNum()-1
      board[row][col]=0
      row=randomNum()-1
      col=randomNum()-1
      board[row][col]=0
      row=randomNum()-1
      col=randomNum()-1
      board[row][col]=0
      row=randomNum()-1
      col=randomNum()-1
      board[row][col]=0
      row=randomNum()-1
      col=randomNum()-1
      board[row][col]=0
      
    }
  }
  // 统计空数量
  function getVoid(board){
    let num=0
    for(let i=0;i<9;i++)
    {
      for(let j=0;j<9;j++)
      {
        if(!board[i][j])num++
      }
    }
    return num
  }

  

 






  // 检测所有是否通关
  function testAll(){
    for(let row=0;row<9;row++)
    {
      for(let col=0;col<9;col++)
      {
        if(board[row][col]==0)return false
        if(!test(row,col,board[row,col])){
          return flase
        }
      }
    }
    return true
  }
  // 点击数字改变鼠标形状
  

 
 
  // 满汉全席
  function FullHouse(){
    for(let boxRow=0;boxRow<3;boxRow++)
    {
      for(let boxCol=0;boxCol<3;boxCol++)
      {
        let n=0
        let row,col,val
        let candidates=[1,2,3,4,5,6,7,8,9]
        for(let i=boxRow*3;i<boxRow*3+3;i++)
        {
          for(let j=boxCol*3;j<boxCol*3+3;j++)
          {
            if(!board[i][j]){
              n++
              row=i
              col=j
            }
            else{
              candidates[board[i][j]-1]=0
            }
          }
        }
        if(n==1){
          val=candidates.filter(item=>item!=0)[0]
          return {row,col,val}
        }
      }
    }
    return {row:-1,col:-1,val:-1}
  }
  // 余差法
  function exclude(){
    let row=col=val=-1
    let arr2=arr=[]
    for (let i = 0; i < 81; i++) {
      row = Math.floor(i / 9)
      col = i % 9
      
      // 找空白
      if (!board[row][col]){
        arr=[]
        arr2=[]
        for(let j=0;j<9;j++)
        {
          if (board[row][j]&&!arr.includes(board[row][j]))
          {
            arr.push(board[row][j])
          }
          if (board[j][col]&&!arr.includes(board[j][col]))
          {
            arr.push(board[j][col])
          }

          
        }
        let m = Math.floor(row / 3)
        let n = Math.floor(col / 3)
        for (let j = 3 * m; j < 3 * m + 3; j++) {
          for (let k = n * 3; k < n * 3 + 3; k++) {
            if (board[j][k]&&!arr.includes(board[j][k])) {
              arr.push(board[j][k])
            }
          }
        }
        arr.sort()
        // console.log(`${row},${col}      ${arr}`);
        if(arr.length!=8)continue
        else{
          for(let j=0;j<8;j++)
          {
            if(j!=arr[j]-1){
              return {row,col,val:j+1,arr2}
            }
          }
          return {row,col,val:9,arr2}
        }
      }
    }
    return {row:-1,col,val,arr2}
  }
  // 摒除法
  function abandon(){

    for(let val=1;val<=9;val++)
    {
      // auxArr记录禁区
      let auxArr=[[],[],[],[],[],[],[],[],[]]
      // auxArr2记录num位置
      let auxArr2=[]
      // 记录渲染格子
      let auxArr3=[]
   
      for(let row=0;row<9;row++)
      {
        for(let col=0;col<9;col++)
        {
          if(board[row][col]){
            auxArr[row][col]=true
            if(board[row][col]==val){
              let obj={row,col}
              auxArr2.push(obj)
            for(let i=0;i<9;i++){
              auxArr[row][i]=true
              auxArr[i][col]=true
            }
            let boxRow=Math.floor(row/3)
            let boxCol=Math.floor(col/3)
            for(let i=boxRow*3;i<boxRow*3+3;i++)
            {
              for(let j=boxCol*3;j<boxCol*3+3;j++)
              {
                auxArr[i][j]=true
              }
            }
          }  
          }

        }
      }
      for(let boxRow=0;boxRow<3;boxRow++)
      {
        for(let boxCol=0;boxCol<3;boxCol++)
        {
          let n=0
          let i1=j1=-1
          let row=col=0
          for(let i=boxRow*3;i<boxRow*3+3;i++)
          {
            for(let j=boxCol*3;j<boxCol*3+3;j++)
            {
              if(!auxArr[i][j]){
                n++
                i1=i
                j1=j
              }
            }
          }
          if (n == 1) {
       
            return { val, row: i1, col: j1, auxArr ,auxArr3}
          }
        }
      }
    }
    return {val:-1,row:-1,col:-1,auxArr3:-1}
  }
  // 笔记法
    function NoteShow() {
      // if (!board[row][col] && !isClear && num != 0) {
      //   if (spanArr[i].innerHTML == '') {
      //     spanArr[i].innerHTML = `<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>`
      //   }
      //   let n = Number(num)
      //   let innerSpanArr = document.querySelectorAll(`.main span:nth-child(${i + 1}) span`)

      //   for (let j = 0; j < 9; j++) {
      //     innerSpanArr[j].style.border = 'none'
      //   }
      //   if (innerSpanArr[n - 1].innerHTML == '') {
      //     innerSpanArr[n - 1].innerHTML = n
      //   }
      //   else {
      //     innerSpanArr[n - 1].innerHTML = ''
      //   }
      // }
      for(let row=0;row<9;row++)
      {
        for(let col=0;col<9;col++)
        {
          if(!board[row][col]){
            spanArr[row*9+col].innerHTML=`<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>`
            let innerSpanArr = document.querySelectorAll(`.main span:nth-child(${row * 9 + col + 1}) span`)
            for(let val of boardNote[row][col])
            {
              let n = Number(val)
              if (innerSpanArr[n - 1].innerHTML == '') {
                innerSpanArr[n - 1].innerHTML = n
              }
              else {
                innerSpanArr[n - 1].innerHTML = ''
              }
            }
            for (let j = 0; j < 9; j++) {
              innerSpanArr[j].style.border = 'none'
            }
          }
        }
      }
      // console.log(boardNote);
  }
  // 隐藏单数
  function HiddenSingle(){
    let row=col=Span=str=auxArr=val=-1
    for (let value = 1; value <= 9; value++) {
      // 行判断
      for (let i = 0; i < 9; i++) {
        let n=0
        auxArr=[]
        for (let j = 0; j < 9; j++) {
          if(boardNote[i][j].includes(value)){
            n++
            row=i
            col=j
            str='行'
            val=value

          }
        }
        if(n==1){
          return {row,col,val,str,auxArr}
        }
      }
      // 列判断
      for (let j = 0; j < 9; j++) {
        let n=0
        auxArr=[]
        for (let i = 0; i < 9; i++) {
          if(boardNote[i][j].includes(value)){
            n++
            row=i
            col=j
            str='列'
            val=value
          }
        }
        if(n==1){
          return {row,col,str,val,auxArr}
        }
      }
    }
    return {row:-1,col,val,str,auxArr}
  }

  // 区块摒除法
  function BlockAbandon(){
    console.log(boardNote);
    for (let val = 1; val <= 9; val++) 
    {
      let row1,row2,row3
      let col1,col2,col3
      let n=0
      for (let boxRow = 0; boxRow < 3; boxRow++) 
      {
        for (let boxCol = 0; boxCol < 3; boxCol++) 
        {
          let auxArr=[]
          n=0
          row1=row2=row3=col1=col2=col3=-1
          for(let row=boxRow*3;row<boxRow*3+3;row++)
          {
            for(let col=boxCol*3;col<boxCol*3+3;col++)
            {
              if(boardNote[row][col].includes(val)){
                n++
                if(n==1){
                  row1=row
                  col1=col
                }
                if(n==2){
                  row2=row
                  col2=col
                }
                if(n==3){
                  row3=row
                  col3=col
                }
              }
            }
          }
          if(n==2){
            console.log(n);
            if(row1==row2){
              let flag=false
              for(let j=0;j<9;j++)
              {
                if(j==col1||j==col2)continue
                if(boardNote[row1][j].includes(val)){
                  boardNote[row1][j]=boardNote[row1][j].filter(item=>item!=val)
                  flag=true
                }
              }
              if(flag){
                if(val==2)console.log({val,str:'行',n,auxArr});
                return {val,str:'行',n,auxArr}
              }
              
            }
            else if(col1==col2){
              let flag=false
              for(let i=0;i<9;i++)
              {
                if(i==row1||i==row2)continue
                if(boardNote[i][col1].includes(val)){
                  boardNote[i][col1]=boardNote[i][col1].filter(item=>item!=val)
                  flag=true
                }
              }
              if(flag){
                return {val,str:'列',n,auxArr}
              }
              
            }
          }
          if(n==3){
            console.log(n);
            if(row1==row2&&row2==row3){
              let flag=false
              for(let j=0;j<9;j++)
              {
                if(j==col1||j==col2||j==col3)continue
                if(boardNote[row1][j].includes(val)){
                  boardNote[row1][j]=boardNote[row1][j].filter(item=>item!=val)
                  flag=true
                }
              }
              if(flag){
                return {val,str:'行',n,auxArr}
              }
              
            }
            else if(col1==col2&&col2==col3){
              let flag=false
              for(let i=0;i<9;i++)
              {
                if(i==row1||i==row2||i==row3)continue
                if(boardNote[i][col1].includes(val)){
                  boardNote[i][col1]=boardNote[i][col1].filter(item=>item!=val)
                  flag=true
                }
              }
              if(flag){
                return {val,str:'列',n,auxArr}
              }
            }
          }
        }
      }
    }

    return {val:-1,str:'',n:0,auxArr:''}
    }
    // 唯一余数
    function NakedSingle() {
      let val
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (boardNote[row][col].length == 1) {
            return {row,col,val:boardNote[row][col][0]}
          }
        }
      }
      return {Span:-1,val:-1}
    }
    // 显性数对
    function NakedPaired(){
      // 行检测
      for(let row=0;row<9;row++)
      {
        let auxArr=[]
        let auxArr2=[]
        let val1,val2,str,row1,row2
        let spanArr1=[]
        for(let col=0;col<9;col++)
        {
          if(boardNote[row][col].length==2){
            auxArr.push(boardNote[row][col])
            // console.log(boardNote[row][col]);
          }
        }
        if(auxArr.length>=2){
          for(let i=0;i<auxArr.length;i++)
          {
            for(let j=i+1;j<auxArr.length;j++)
            {
              if(auxArr[i][0]==auxArr[j][0]&&auxArr[i][1]==auxArr[j][1]){
                auxArr2.push(auxArr[i])
                auxArr2.push(auxArr[j])
              }
            }
            
          }
          if (auxArr2.length == 2) {
            val1=auxArr2[0][0]
            val2=auxArr2[0][1]
            str='行'
            let n=0
            for(let i=0;i<9;i++)
            {
              if(boardNote[row][i].includes(val1)&&boardNote[row][i].includes(val2)&&boardNote[row][i].length==2){
                n++
                if(n==1)row1=i
                if(n==2)row2=i
              }
            }
            for(let i=0;i<9;i++)
            {
              if(boardNote[row][i].length>=2&&i!==row1&&i!=row2){
                if(boardNote[row][i].includes(auxArr2[0][0])){
                  let index=boardNote[row][i].indexOf(val1)
                  boardNote[row][i].splice(index,1)
                }
                if(boardNote[row][i].includes(auxArr2[0][1])){
                  let index=boardNote[row][i].indexOf(val2)
                  boardNote[row][i].splice(index,1)
                }
              }
              if(boardNote[row][i].length==2){
                if(boardNote[row][i].includes(auxArr2[0][0])&&boardNote[row][i].includes(auxArr2[0][1])){
                }
              }
            }
            if(spanArr1.length){
              return {auxArr2,val1,val2,str}
            }
          }
        }
        
      }

      // 列检测
      for(let col=0;col<9;col++)
      {
        let auxArr=[]
        let auxArr2=[]
        let spanArr1=[]
        let spanArr2=[]
        let val1,val2,str,col1,col2
        for(let row=0;row<9;row++)
        {
          if(boardNote[row][col].length==2){
            auxArr.push(boardNote[row][col])
          }
        }
        if(auxArr.length>=2){
          for(let i=0;i<auxArr.length;i++)
          {
            for(let j=i+1;j>auxArr.length;j++)
            {
              if(auxArr[i][0]==auxArr[j][0]&&auxArr[i][1]==auxArr[j][1]){
                auxArr2.push(auxArr[i])
                auxArr2.push(auxArr[j])
              }
            }
            
          }
          if (auxArr2.length == 2) {
            val1=auxArr2[0][0]
            val2=auxArr2[0][1]
            str='列'
            let n=0
            for(let i=0;i<9;i++)
            {
              if(boardNote[i][col].includes(val1)&&boardNote[i][col].includes(val2)&&boardNote[i][col].length==2){
                n++
                if(n==1)col1=i
                if(n==2)col2=i
                
              }
            }
            for(let i=0;i<9;i++)
            {
              if(boardNote[i][col].length>=2&&i!=col1&&i!=col2){
                if(boardNote[i][col].includes(auxArr2[0][0])){
                  let index=boardNote[i][col].indexOf(val1)
                  boardNote[i][col].splice(index,1)
                  spanArr1.push(spanArr[i*9+col])
                }
                if(boardNote[i][col].includes(auxArr2[0][1])){
                  let index=boardNote[i][col].indexOf(val2)
                  boardNote[i][col].splice(index,1)
                  spanArr1.push(spanArr[i*9+col])
                }
              }
              if(boardNote[i][col].length==2){
                if(boardNote[i][col].includes(auxArr2[0][0])&&boardNote[i][col].includes(auxArr2[0][1])){
                  spanArr2.push(spanArr[i*9+col])
                }
              }
            }
            if(spanArr1.length){
              return {spanArr1,spanArr2,auxArr2,val1,val2,str}
            }
          }
        }
      }
      return {spanArr1:-1,spanArr2:-1,auxArr2:-1,val1:-1,val2:-1,str:-1}
    }
 
   
   
    function difficultyRatio(){
      n1=n2=n3=n4=n5=n6=n7=0
      while(!testAll()){
        let flag=false
        // 满汉全席1
        if (true) {
          let { row, col, val } = FullHouse()
          if (row != -1) {
            board_test[row][col] = true
            add(row, col, val)
            refreshBoardNote()
            n1++
            flag=true
            continue
          }

        }
        // 摒除法检测2
        if (true) {
          let { val, row, col, auxArr, auxArr3 } = abandon()
          if (val != -1) {
            if (auxArr) {
              // spanArr[row*9+col].classList
              board_test[row][col] = true
              add(row, col, val)
              refreshBoardNote()
              n2++
            flag=true
            continue
            }
          }


        }
        // 余差法检测3
        if (true) {
          let { row, col, val, arr2 } = exclude()

          // console.log(arr2);
          if (row != -1) {
            board_test[row][col] = true
            let numArr = []
            add(row, col, val)
            refreshBoardNote()
            n3++
            flag=true
            continue
          }
        }
        // 隐藏单数4
        if (true) {
          let { row, col, Span, str, auxArr } = HiddenSingle()
          if (row != -1) {
            board_test[row][col] = true
            add(row, col, val)
            refreshBoardNote()
            n4++
            flag=true
            continue
          }
        }
        // 区块摒除法检测5
        if (true) {
          let { val, str, n, auxArr } = BlockAbandon()
          if (val != -1) {

            n5++
            flag=true
            continue

          }
        }
        // 唯一余数检测6
        if (true) {
          let { row, col, Span, val } = NakedSingle()
          if (Span != -1) {
            board_test[row][col] = true
            boardNote[row][col] = boardNote[row][col].filter(item => item != val)
            add(row, col, val)
            refreshBoardNote()
            n6++
            flag=true
            continue
          }
        }
        // 显性数对
        if(true){
          let {spanArr1,spanArr2,auxArr2,val1,val2,str}=NakedPaired()
          if(spanArr1!=-1){
            n7++
            flag=true
            continue
          }
        }
        if(!flag)return false
      }
    console.log((`满汉全席：${n1}摒除法：${n2}余差法：${n3}隐藏单数：${n4}区块摒除：${n5}唯一余数：${n6}显性数对：${n7}`));
      return true

    }
    
 
 
  // 评估算法
  let sumNodes=0
  let ratio=0
  let solution=0
  function evaluateSudokuDifficulty(sudoku) {
        sumNodes=0
        ratio=0
        // 将数独转化为一维数组
        const board = sudoku.flat();
        // 计算空格数量
        const numEmptyCells = board.filter((cell) => cell === 0).length;
        // 使用递归算法解决数独，并返回搜索树信息
        const { numNodes, numPaths, maxDepth, ValidNodes, inValidNodes } = solveSudokuRecursive(board, 0);
        // console.log(ValidNodes+inValidNodes);
        sumNodes=ValidNodes+inValidNodes
        ratio=ValidNodes/(ValidNodes+inValidNodes)
        console.log('总次数：'+sumNodes);
        console.log('难度系数：'+ratio);
        console.log('方程解數量：'+solution);

        return
        // 计算有效路径比例
        const branchingFactor = numNodes / numPaths;
        const effectiveBranchingFactor = (branchingFactor - 1) * numPaths / (numNodes - numPaths);
        const effectivePathRatio = Math.pow(effectiveBranchingFactor, maxDepth);
        // 计算难度评价值
        const difficulty = 2 + 0.01 * numEmptyCells + Math.log10(numNodes) + Math.log10(effectivePathRatio);
        return difficulty;
    }

    // 使用递归算法解决数独，并返回搜索树信息
    function solveSudokuRecursive(board, index) {
        // 边界情况：如果解决完所有空格，则返回搜索树信息
        if (index >= board.length) {
            // console.log(index);
            solution++
            return { numNodes: 0, numPaths: 1, maxDepth: 0 ,inValidNodes:0 ,ValidNodes:0};
        }
        // 计算下一个空格的位置
        while (board[index] !== 0) {
            index++;
            if(index==81){
                solution++
                return { numNodes: 0, numPaths: 1, maxDepth: 0 ,inValidNodes:0 ,ValidNodes:0};
            }
        }
        
        // console.log(index);
        // if(index==79){
        //     console.table(board);
        // }
        
        // console.log('');
        // 使用回溯法尝试填写数字，统计搜索树信息
        let numNodes = 1;             // 搜索树节点数
        let numPaths = 0;             // 有效路径数
        let maxDepth = 0;             // 搜索树深度
        let inValidNodes=0           
        let ValidNodes=0           
        const candidates = getCandidates(board, index);
        for (let i = 0; i < candidates.length; i++) {
            if(index==79){
            // console.log(candidates);
        }
            board[index] = candidates[i];
            const { numNodes: childNodes, numPaths: childPaths, maxDepth: childDepth ,inValidNodes:childinValidNodes, ValidNodes:childValidNodes} = solveSudokuRecursive(board, index + 1);
            ValidNodes+=childValidNodes
            inValidNodes+=childinValidNodes
            numNodes += childNodes;
            numPaths += childPaths;
            maxDepth = Math.max(maxDepth, childDepth);
        //     if(index==79){
        //     console.log('ok2');
        // }
        }
        
        // 如果当前节点没有有效子节点，则视为死胡同
        if (numPaths === 0) {
            inValidNodes++
        } else {
            numPaths = Math.max(1, numPaths);  // 避免分母为零
            maxDepth++;
            ValidNodes++
        }
        // 回溯
        board[index] = 0;
        return { numNodes, numPaths, maxDepth,ValidNodes,inValidNodes};
    }

    // 获取指定位置的候选数字
    function getCandidates(board, index) {
        // 计算所在区块的行号和列号
        const row = Math.floor(index / 9);
        const col = index % 9;
        const blockRow = Math.floor(row / 3);
        const blockCol = Math.floor(col / 3);
        // 初始化候选数字
        const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // 检查所在行、所在列和所在区块中已经出现的数字
        for (let i = 0; i < 9; i++) {
            const rowValue = board[row * 9 + i];
            const colValue = board[i * 9 + col];
            const blockValue = board[(blockRow * 3 + Math.floor(i / 3)) * 9 + blockCol * 3 + (i % 3)];
            candidates[rowValue - 1] = 0;
            candidates[colValue - 1] = 0;
            candidates[blockValue - 1] = 0;
        }
        // 过滤掉已经出现过的数字
        return candidates.filter((value) => value !== 0);
    }



//   区分难易度
//   let easy=document.querySelector('.easy')
//   let middle=document.querySelector('.middle')
//   let hard=document.querySelector('.hard')
//   easy.addEventListener('click',function(){
//     initialization()
//     random()
//     solveSudoku(board);
//     target=board.map(item=>[...item])
//     dig1()
//     record()
//     evaluateSudokuDifficulty(board)
//     let auxBoard=deepcopy(board)
//     isFirst=false
//     refreshBoardNote()
//     difficultyRatio()
//     while (solution!=1||(n1+n2)/(n1+n2)!=1||n1+n2!=40) {
//     // while (ratio<0.03|| sumNodes > 2000||solution!=1) {
//       initialization()
//       random()
//       solveSudoku(board);
//       target=board.map(item=>[...item])
//       dig1()
//       auxBoard=deepcopy(board)
//       record()
//       isFirst=false
//       refreshBoardNote()
//       difficultyRatio()
//       evaluateSudokuDifficulty(board)
//       console.log(solution);
//     }
//     board=deepcopy(auxBoard)
//     show()
//     record()
//     numShow()
//     isFirst=false
//     refreshBoardNote()
//     // console.log('总次数：'+sumNodes);
//     // console.log('难度系数：'+ratio);
//     console.log('over');
//     console.log((`满汉全席：${n1}摒除法：${n2}余差法：${n3}隐藏单数：${n4}区块摒除：${n5}唯一余数：${n6}`));
//   })

//   middle.addEventListener('click',function(){
//     initialization()
//     random()
//     solveSudoku(board);
//     target=board.map(item=>[...item])
//     dig2()
//     record()
//     evaluateSudokuDifficulty(board)
//     let auxBoard=deepcopy(board)
//     isFirst=false
//     refreshBoardNote()
//     difficultyRatio()

//     while (solution!=1||(n1+n2+n3+n4+n5+n6+n7)!=50||n3==0) {
//     // while (solution!=1||n7==0) {
//       initialization()
//       random()
//       solveSudoku(board);
//       target=board.map(item=>[...item])
//       dig2()
//       auxBoard=deepcopy(board)
//       record()
//       isFirst=false
//       refreshBoardNote()
//     difficultyRatio()
//       evaluateSudokuDifficulty(board)
//       if(ratio==0)break
//     }
//     board=deepcopy(auxBoard)
//     show()
//     record()
//     numShow()
//     isFirst=false
//     refreshBoardNote()

//     // console.log('总次数：'+sumNodes);
//     // console.log('难度系数：'+ratio);
//     console.log('over');
//     console.log((`满汉全席：${n1}摒除法：${n2}余差法：${n3}隐藏单数：${n4}区块摒除：${n5}唯一余数：${n6} 显性数对：${n7}`));

//   })

//   hard.addEventListener('click',function(){
//     let flag=false
//     initialization()
//     random()
//     solveSudoku(board);
//     target=board.map(item=>[...item])
//     dig3()
//     record()
//     evaluateSudokuDifficulty(board)
//     let auxBoard=deepcopy(board)
//     isFirst=false
//     refreshBoardNote()
//     flag=difficultyRatio()
//     while (solution!=1||n5==0||!flag) {
//       initialization()
//       random()
//       solveSudoku(board);
//       target=board.map(item=>[...item])
//       dig3()
//       auxBoard=deepcopy(board)
//       record()
//       isFirst=false
//       refreshBoardNote()
//       flag=difficultyRatio()
//       evaluateSudokuDifficulty(board)
//     }
//     // initialization()
//     board=deepcopy(auxBoard)
//     isFirst=false
//     show()
//     record()
//     numShow()
//     refreshBoardNote()

//     console.log('over');
//     console.log((`满汉全席：${n1}摒除法：${n2}余差法：${n3}隐藏单数：${n4}区块摒除：${n5}唯一余数：${n6}显性数对：${n7}`));
    
   
//   })
  // 防止一个宫内全部为空
    function testPalace() {
      for (let boxRowStart = 0; boxRowStart < 3; boxRowStart++) {
        for (let boxColStart = 0; boxColStart < 3; boxColStart++) {
          let flag=false
          for (let i = boxRowStart; i < boxRowStart + 3; i++) {
            for (let j = boxColStart; j < boxColStart + 3; j++) {
              if (board[i][j]) {
                flag=true
              }
            }
          }
          if(flag==false)return false
        }
      }
      return true
    }
// 数组初始化
function initialization() {
  isHasNote = false
  boardNote = [[], [], [], [], [], [], [], [], []]
  num = 0
  isWork = false
  solution = 0
  action = []
  isNote = false
  isClear = false

  board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  board_test = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ];
}

// 记录笔记数组
function refreshBoardNote() {
  boardNote2 = [[], [], [], [], [], [], [], [], []]
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      let candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      if (board[row][col]) {
        boardNote2[row][col] = []

      }
      else {
        const blockRow = Math.floor(row / 3);
        const blockCol = Math.floor(col / 3);
        for (let i = 0; i < 9; i++) {
          const rowValue = board[row][i];
          const colValue = board[i][col];
          const blockValue = board[blockRow * 3 + Math.floor(i / 3)][blockCol * 3 + i % 3];
          candidates[rowValue - 1] = 0;
          candidates[colValue - 1] = 0;
          candidates[blockValue - 1] = 0;
        }
        boardNote2[row][col] = candidates.filter((value) => value != 0)

      }

    }
  }
  if (!isFirst) {
    boardNote = deepcopy(boardNote2)
    isFirst = true
  }
  else {
    mergeBoardNote()
  }
}
// 笔记数组取交集
function mergeBoardNote() {
  let boardNote3 = [[], [], [], [], [], [], [], [], []]
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      boardNote3[i][j] = []
    }
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      for (let val = 1; val <= 9; val++) {
        if (boardNote[i][j].includes(val) && boardNote2[i][j].includes(val)) {
          boardNote3[i][j].push(val)
        }
      }
      boardNote3[i][j].sort()
    }
  }
  boardNote = deepcopy(boardNote3)
}
// 深拷贝
function deepcopy(obj) {
  var out = [], i = 0, len = obj.length;
  for (; i < len; i++) {
    if (obj[i] instanceof Array) {
      out[i] = deepcopy(obj[i]);
    }
    else out[i] = obj[i];
  }
  return out;
}
// 检测是否为最终位置
function isTarget(row, col, num) {
  if (target[row][col] == num) return true
  return false

}

const { log } = require('console');
let fs = require('fs')

function getEasy() {
  let easyArr = []
  while (easyArr.length < 100) {
    initialization()
    random()
    solveSudoku(board);
    target = board.map(item => [...item])
    dig1()
    record()
    evaluateSudokuDifficulty(board)
    let auxBoard = deepcopy(board)
    isFirst = false
    refreshBoardNote()
    difficultyRatio()
    while (solution != 1 || (n1 + n2) / (n1 + n2) != 1 || n1 + n2 != 40) {
      // while (ratio<0.03|| sumNodes > 2000||solution!=1) {
      initialization()
      random()
      solveSudoku(board);
      target = board.map(item => [...item])
      dig1()
      auxBoard = deepcopy(board)
      record()
      isFirst = false
      refreshBoardNote()
      difficultyRatio()
      evaluateSudokuDifficulty(board)
    }
    board = deepcopy(auxBoard)
    easyArr.push(board)
    record()
    isFirst = false
    refreshBoardNote()
  }
  let str = JSON.stringify(easyArr)
  fs.writeFile('easy.txt', str, () => {

  })

}
function getMiddle() {
  let middleArr = []
  while (middleArr.length < 100) {
    console.log('haved:' + middleArr.length);
    initialization()
    random()
    solveSudoku(board);
    target = board.map(item => [...item])
    dig2()
    record()
    evaluateSudokuDifficulty(board)
    let auxBoard = deepcopy(board)
    isFirst = false
    refreshBoardNote()
    difficultyRatio()
    while (solution != 1 || (n1 + n2 + n3 + n4 + n5 + n6 + n7) != 50 || n3 == 0) {
      // while (ratio<0.03|| sumNodes > 2000||solution!=1) {
      initialization()
      random()
      solveSudoku(board);
      target = board.map(item => [...item])
      dig2()
      auxBoard = deepcopy(board)
      record()
      isFirst = false
      refreshBoardNote()
      difficultyRatio()
      evaluateSudokuDifficulty(board)
    }
    board = deepcopy(auxBoard)
    middleArr.push(board)
    record()
    isFirst = false
    refreshBoardNote()
    
  }
 
  let str = JSON.stringify(middleArr)
  fs.writeFile('middle.txt', str, () => {

  })
}
function getHard() {
  let hardArr = []
  while (hardArr.length < 10) {
    let flag = false
    initialization()
    random()
    solveSudoku(board);
    target = board.map(item => [...item])
    dig3()
    record()
    evaluateSudokuDifficulty(board)
    let auxBoard = deepcopy(board)
    isFirst = false
    refreshBoardNote()
    flag = difficultyRatio()
    while (solution != 1 || n5 == 0 || !flag) {
      // while (ratio<0.03|| sumNodes > 2000||solution!=1) {
      initialization()
      random()
      solveSudoku(board);
      target = board.map(item => [...item])
      dig3()
      auxBoard = deepcopy(board)
      record()
      isFirst = false
      refreshBoardNote()
      flag = difficultyRatio()
      evaluateSudokuDifficulty(board)
    }
    board = deepcopy(auxBoard)
    hardArr.push(board)
    record()
    isFirst = false
    refreshBoardNote()
  
 
    
  }
  let str = JSON.stringify(hardArr)
  // console.log(str);
  fs.writeFile('hard10.txt', str, () => {
  })


}
getHard()

