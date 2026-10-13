const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const elements=new Map(),timers=[];
function element(){const classes=new Set();return {dataset:{},children:[],attributes:{},events:{},open:false,classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)},setAttribute(k,v){this.attributes[k]=v;},append(...children){this.children.push(...children);},replaceChildren(...children){this.children=children;},addEventListener(k,v){this.events[k]=v;},showModal(){this.open=true;},close(){this.open=false;},focus(){this.focused=true;}};}
const keys=['basics','setup','visualizer','metrics','algorithms','code','game'];
const triggers=keys.map(help=>Object.assign(element(),{dataset:{help}}));
const tabs=keys.map(topic=>Object.assign(element(),{dataset:{topic}}));
const document={documentElement:element(),getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},querySelectorAll(q){return q==='[data-help]'?triggers:tabs;},createElement:element};
const context={document,window:{matchMedia:()=>({matches:false})},localStorage:{getItem(){throw Error('Storage blocked');},setItem(){throw Error('Storage blocked');}},setTimeout(fn){timers.push(fn);return timers.length;},clearTimeout(){},stop(){context.pauses++;},render(){},pauses:0};
vm.runInNewContext(fs.readFileSync(require.resolve('../theme.js'),'utf8'),context);
assert.equal(document.documentElement.dataset.theme,'light');
vm.runInNewContext(fs.readFileSync(require.resolve('../help.js'),'utf8'),context);
const get=id=>elements.get(id);
get('themeToggle').onclick();assert.equal(document.documentElement.dataset.theme,'dark');assert.equal(get('themeToggle').attributes['aria-pressed'],'true');
get('themeToggle').onclick();assert.equal(document.documentElement.dataset.theme,'light');
for(let i=0;i<keys.length;i++){triggers[i].events.click();assert(get('helpDialog').open);assert(get('helpTitle').textContent.length>10);assert(get('helpDetails').children.length>=4);assert.equal(tabs[i].attributes['aria-pressed'],'true');}
assert.equal(context.pauses,7);
tabs[0].events.click();assert(get('helpTitle').textContent.includes('DSA'));
let prevented=false;get('helpDialog').events.cancel({preventDefault(){prevented=true;}});assert(prevented);timers.pop()();assert(!get('helpDialog').open);
triggers[0].events.click();get('helpClose').onclick();timers.pop()();assert(!get('helpDialog').open);
triggers[0].events.click();get('helpDone').onclick();timers.pop()();assert(!get('helpDialog').open);
console.log('Passed experience checks: theme fallback/toggle, seven help topics, playback pause, Escape, Close and Got it. Browser layout and native focus behavior require visual QA.');

