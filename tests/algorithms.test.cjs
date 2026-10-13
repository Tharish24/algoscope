const assert=require('node:assert/strict');
const {definitions,trace}=require('../algorithms.js');
let cases=0;
const inputs=[[5],[1,2,3,4,5],[5,4,3,2,1],[4,4,2,2,4],[100,1,50,2,99]];
let seed=123456;function random(){seed=(seed*1664525+1013904223)>>>0;return seed%100+1;}
for(let i=0;i<30;i++)inputs.push(Array.from({length:5+i},random));
for(const [key,d] of Object.entries(definitions))for(const input of inputs){const before=[...input];if(d.group==='sorting'){const frames=trace(key,input),last=frames.at(-1);assert.deepEqual(last.values,[...input].sort((a,b)=>a-b));assert(last.done);for(let i=1;i<frames.length;i++){assert(frames[i].comparisons>=frames[i-1].comparisons);assert(frames[i].writes>=frames[i-1].writes);}if(frames.length>1){const original=frames[1].values[0];frames[0].values[0]=-999;assert.equal(frames[1].values[0],original);}cases++;}else for(const target of [input[0],input.at(-1),101]){const last=trace(key,input,target).at(-1);assert(last.done);assert.equal(last.found>=0,input.includes(target));if(last.found>=0)assert.equal(last.values[last.found],target);assert.equal(last.writes,0);cases++;}assert.deepEqual(input,before);}
assert.equal(trace('bubble',[1,2,3,4,5]).at(-1).comparisons,4);
assert.equal(trace('linear',[1,2,3,4,5],9).at(-1).comparisons,5);
console.log(`Passed ${cases} algorithm cases: sorting correctness, duplicates, seeded random inputs, search hits/misses, immutable snapshots and counters.`);

