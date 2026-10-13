/* Independent, five-round bubble-sort decision game. */
(() => {
  const el=id=>document.getElementById(id);
  let round=0,score=0,answered=false,question;
  function makeQuestion(){
    const values=Array.from({length:6},()=>Math.floor(Math.random()*90)+10);
    const pair=Math.floor(Math.random()*5);
    // Include keep, swap and equal-value decisions during every game.
    const type=round%3;
    const low=Math.floor(Math.random()*70)+10, high=low+Math.floor(Math.random()*20)+1;
    values[pair]=type===0?high:low;
    values[pair+1]=type===2?low:type===0?low:high;
    return {values,pair,swap:values[pair]>values[pair+1]};
  }
  function draw(){
    el('gameArray').replaceChildren(...question.values.map((v,i)=>{
      const tile=document.createElement('div');tile.className='game-tile';
      if(i===question.pair||i===question.pair+1)tile.classList.add('selected');
      const value=document.createElement('strong');value.textContent=v;
      const index=document.createElement('span');index.textContent=`index ${i}`;
      tile.append(value,index);return tile;
    }));
    el('gameArray').setAttribute('aria-label',`Array ${question.values.join(', ')}. Comparing indices ${question.pair} and ${question.pair+1}: ${question.values[question.pair]} and ${question.values[question.pair+1]}.`);
  }
  function startRound(){
    answered=false;question=makeQuestion();draw();
    el('gameRound').textContent=`Round ${round+1} / 5`;
    el('gameScore').textContent=`${score} points`;
    el('gameSwap').disabled=false;el('gameKeep').disabled=false;el('gameNext').disabled=true;
    el('gameFeedback').className='game-feedback';
    el('gameFeedback').textContent=`Compare ${question.values[question.pair]} (left) with ${question.values[question.pair+1]} (right). Swap or keep?`;
  }
  function answer(choice){
    if(answered)return;answered=true;
    const correct=choice===question.swap;
    if(correct)score+=10;
    const left=question.values[question.pair],right=question.values[question.pair+1];
    const reason=question.swap?`${left} > ${right}, so swap them to put the smaller value first.`:left===right?`${left} = ${right}. Equal values stay in place.`:`${left} < ${right}, so this pair is already in the correct order.`;
    if(question.swap){[question.values[question.pair],question.values[question.pair+1]]=[right,left];draw();}
    el('gameSwap').disabled=true;el('gameKeep').disabled=true;
    el('gameScore').textContent=`${score} points`;
    el('gameFeedback').className=`game-feedback ${correct?'correct':'incorrect'}`;
    const finished=round===4;
    el('gameFeedback').textContent=`${correct?'Correct! +10 points.':'Good try!'} ${reason}${finished?` Game complete: ${score} / 50. ${score===50?'Perfect run!': 'Play again to practice the comparison rule.'}`:''}`;
    el('gameNext').disabled=finished;
    if(!finished)el('gameNext').focus();else el('gameRestart').focus();
  }
  el('gameSwap').onclick=()=>answer(true);
  el('gameKeep').onclick=()=>answer(false);
  el('gameNext').onclick=()=>{if(!answered||round>=4)return;round++;startRound();el('gameSwap').focus();};
  el('gameRestart').onclick=()=>{round=0;score=0;startRound();el('gameSwap').focus();};
  startRound();
})();
