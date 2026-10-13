/* Pure trace generators: each frame is an independent snapshot. */
(function (root) {
  const definitions = {
    bubble: {name:'Bubble sort',group:'sorting',time:'O(n²)',space:'O(1)',best:'O(n)',description:'Compare neighbors and swap them when they are out of order. Each pass settles the largest remaining value.',code:['Repeat passes over the unsorted range','Compare adjacent values','Swap if left > right','Mark the last value settled','Stop if a pass made no swaps']},
    selection: {name:'Selection sort',group:'sorting',time:'O(n²)',space:'O(1)',best:'O(n²)',description:'Find the smallest remaining value, then place it at the beginning of the unsorted range.',code:['For each position i','Find the minimum in i…n−1','Swap the minimum into position i','Mark position i settled']},
    insertion: {name:'Insertion sort',group:'sorting',time:'O(n²)',space:'O(1)',best:'O(n)',description:'Grow a sorted prefix by moving each new value left until it reaches its correct position.',code:['For each value after the first','Compare with the previous value','Swap backward while out of order','The prefix is now sorted']},
    merge: {name:'Merge sort',group:'sorting',time:'O(n log n)',space:'O(n)',best:'O(n log n)',description:'Split the array into halves, sort each half, then merge the sorted halves back together.',code:['Split range into two halves','Recursively sort both halves','Compare the next value in each half','Write the smaller value back','Copy remaining values']},
    quick: {name:'Quick sort',group:'sorting',time:'O(n²)',space:'O(n)',best:'O(n log n)',description:'Choose the last value as a pivot, partition smaller values to its left, then sort both sides. Sorted input can trigger the worst case.',code:['Choose the last value as pivot','Compare each value with pivot','Move smaller values to the left','Put pivot in its final position','Recursively sort both partitions']},
    linear: {name:'Linear search',group:'searching',time:'O(n)',space:'O(1)',best:'O(1)',description:'Check each value in order until the target is found or the array ends.',code:['Start at the first value','Compare value with target','If equal, return its index','Otherwise move to the next value','Return not found if exhausted']},
    binary: {name:'Binary search',group:'searching',time:'O(log n)',space:'O(1)',best:'O(1)',description:'On sorted data, compare the middle value and discard half of the remaining range. This demo sorts input before the trace; preprocessing is excluded from the counters.',code:['Set low = 0 and high = n−1','Compare middle value with target','If equal, return its index','If middle < target, move low right','Otherwise move high left','Return not found when range is empty']}
  };
  function trace(key, input, target=50) {
    if(!definitions[key]) throw new Error('Unknown algorithm');
    const a=[...input]; if(key==='binary')a.sort((x,y)=>x-y);
    const frames=[];let comparisons=0,writes=0; const settled=new Set();
    function emit(message,line=0,active=[],extra={}) {frames.push({values:[...a],message,line,active:[...active],settled:[...settled],comparisons,writes,...extra});}
    function compare(i,j,line=1){comparisons++;emit(`Compare ${a[i]} and ${a[j]}.`,line,[i,j]);}
    function swap(i,j,line=2){if(i!==j){[a[i],a[j]]=[a[j],a[i]];writes+=2;}emit(`Swap positions ${i} and ${j}.`,line,[i,j]);}
    emit(key==='binary'?'Input sorted for binary search. Indices refer to this sorted array.':'Ready. Follow the highlighted values to see each operation.');
    if(key==='bubble')for(let end=a.length-1;end>0;end--){let changed=false;for(let j=0;j<end;j++){compare(j,j+1);if(a[j]>a[j+1]){swap(j,j+1);changed=true;}}settled.add(end);emit(`Position ${end} is settled.`,3);if(!changed){emit('No swaps this pass: the array is sorted.',4);break;}}
    if(key==='selection')for(let i=0;i<a.length;i++){let min=i;for(let j=i+1;j<a.length;j++){compare(min,j);if(a[j]<a[min])min=j;}swap(i,min);settled.add(i);emit(`Position ${i} is settled.`,3);}
    if(key==='insertion')for(let i=1;i<a.length;i++){let j=i;while(j>0){compare(j-1,j);if(a[j-1]<=a[j])break;swap(j-1,j);j--;}emit(`Prefix through position ${i} is sorted.`,3,Array.from({length:i+1},(_,k)=>k));}
    if(key==='merge'){
      function sort(lo,hi){if(lo>=hi)return;const mid=Math.floor((lo+hi)/2);emit(`Split positions ${lo}…${hi}.`,0,[lo,hi]);sort(lo,mid);sort(mid+1,hi);const left=a.slice(lo,mid+1),right=a.slice(mid+1,hi+1);let i=0,j=0,k=lo;while(i<left.length&&j<right.length){comparisons++;emit(`Compare buffered values ${left[i]} and ${right[j]}.`,2,[lo+i,mid+1+j]);a[k]=left[i]<=right[j]?left[i++]:right[j++];writes++;emit(`Write ${a[k]} to position ${k}.`,3,[k]);k++;}while(i<left.length){a[k]=left[i++];writes++;emit(`Copy remaining value ${a[k]}.`,4,[k++]);}while(j<right.length){a[k]=right[j++];writes++;emit(`Copy remaining value ${a[k]}.`,4,[k++]);}}sort(0,a.length-1);
    }
    if(key==='quick'){
      function sort(lo,hi){if(lo>hi)return;if(lo===hi){settled.add(lo);return;}emit(`Pivot is ${a[hi]}.`,0,[hi],{pivot:hi});let i=lo;for(let j=lo;j<hi;j++){comparisons++;emit(`Compare ${a[j]} with pivot ${a[hi]}.`,1,[j,hi],{pivot:hi});if(a[j]<a[hi]){swap(i,j);i++;}}swap(i,hi,3);settled.add(i);emit(`Pivot settled at position ${i}.`,3,[i]);sort(lo,i-1);sort(i+1,hi);}sort(0,a.length-1);
    }
    if(definitions[key].group==='searching'){
      let found=-1;
      if(key==='linear'){for(let i=0;i<a.length;i++){comparisons++;emit(`Check index ${i}: is ${a[i]} equal to ${target}?`,1,[i]);if(a[i]===target){found=i;break;}}}
      else {let lo=0,hi=a.length-1;while(lo<=hi){const mid=Math.floor((lo+hi)/2);comparisons++;emit(`Range ${lo}…${hi}. Compare ${a[mid]} with ${target}.`,1,[mid],{range:[lo,hi]});if(a[mid]===target){found=mid;break;}if(a[mid]<target){lo=mid+1;emit('Target is larger. Search the right half.',3,[],{range:[lo,hi]});}else {hi=mid-1;emit('Target is smaller. Search the left half.',4,[],{range:[lo,hi]});}}}
      emit(found<0?`Target ${target} was not found.`:`Found ${target} at index ${found}.`,found<0?(key==='binary'?5:4):2,found<0?[]:[found],{done:true,found});
    }else {a.forEach((_,i)=>settled.add(i));emit('Sorted! Every value is in ascending order.',0,[],{done:true});}
    return frames;
  }
  root.DSA={definitions,trace};
  if(typeof module!=='undefined')module.exports=root.DSA;
})(typeof globalThis!=='undefined'?globalThis:window);
