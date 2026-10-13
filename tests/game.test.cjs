// Test game behavior with a minimal DOM stand-in; this does not verify browser layout.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const elements=new Map();
function element(){return {textContent:'',disabled:false,children:[],classList:{add(){}},append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;},setAttribute(){},focus(){}};}
const document={getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},createElement:element};
vm.runInNewContext(fs.readFileSync(require.resolve('../game.js'),'utf8'),{document,Math});
const get=id=>elements.get(id);
function correctChoice(){const match=get('gameFeedback').textContent.match(/Compare (\d+) \(left\) with (\d+)/);assert(match);return +match[1]>+match[2]?'gameSwap':'gameKeep';}
for(let round=0;round<5;round++){
  assert.equal(get('gameRound').textContent,`Round ${round+1} / 5`);
  assert(get('gameNext').disabled);
  const choice=correctChoice();get(choice).onclick();
  assert.equal(get('gameScore').textContent,`${(round+1)*10} points`);
  get(choice).onclick();assert.equal(get('gameScore').textContent,`${(round+1)*10} points`,'Repeated answers must not add points');
  if(round<4)get('gameNext').onclick();
}
assert(get('gameFeedback').textContent.includes('Game complete: 50 / 50'));
assert(get('gameNext').disabled);
get('gameNext').onclick();assert.equal(get('gameRound').textContent,'Round 5 / 5');
get('gameRestart').onclick();assert.equal(get('gameScore').textContent,'0 points');assert.equal(get('gameRound').textContent,'Round 1 / 5');
const wrong=correctChoice()==='gameSwap'?'gameKeep':'gameSwap';get(wrong).onclick();assert.equal(get('gameScore').textContent,'0 points');assert(get('gameFeedback').textContent.includes('Good try!'));
console.log('Passed game checks: five-round scoring, duplicate-answer guard, completion, restart and wrong-answer feedback.');

