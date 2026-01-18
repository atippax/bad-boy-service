const members = []
let startTime = new Date();
for(let i =0;i<100;i++){
    members.push(`${i}`)
}
const teamLock = []
const pair= []
members.forEach((x,indexX)=>{
  pair.push([])
  members.forEach((y,indexY)=>{
    const array = []
    array.push(x)
    if(indexY!=indexX){
      array.push(y)
    }
    if(members.length%2!=0 || array.length==2)pair[indexX].push(array)
  })
})


const team = []
let indexSelected = members.length
pair.forEach(x=>{
  const _team = []
  for (var i = 0; members.length-i > Math.floor(pair.length/2); i++) {
    // console.log(indexSelected,i,indexSelected-1-i)
    _team.push(pair[i][indexSelected-1-i])
  }
  indexSelected--
  if(indexSelected==Math.floor(members.length/2))indexSelected=members.length
  team.push(_team)
})
const paired = []
const c = pair.map(x=>x.map(y=> y.slice().sort()))
c.forEach(f=>{
f.forEach(t=>{
  if(!paired.some(x=>x.join(',')==t.join(','))){
    paired.push(t)
  }
})
  
})
const teams = []
let indexParent = 0
let error = false
let hasAdded = []
for(let i =0;i<members.length-1;i++){
    const header = paired.filter(x=>x[0]===members[0] && !teams.some(s=>s[0]==x))
    const compare = [header[0]]
    const maxteam = Math.ceil(members.length/2)
    if(error){indexParent++}
    let indexBody = indexParent
    error = false
    let indexChild = indexBody
    let isReturn = false
    for(let j=0;j<maxteam-1;){
      const _paired = paired.filter(x=>!hasAdded.some(y=>y==x)) 
       const body= _paired.filter(f=>!f.some(v=>compare.some(g=>g.some(h=>h===v))))
 
       if(body.length===0){
           compare.pop()
           indexBody++
           indexChild++
           j--
           isReturn = true
       }
       else{
        // if(indexBody >= body.length){
        //   j = 0
        //   error = true
        //   i --
        // }
        let index = indexChild == indexBody ? indexBody:indexChild>indexBody?!isReturn?indexBody:indexChild:indexBody
        if(index >= body.length){
          j = maxteam
          error = true
          i-=2
          teams.pop()
        }
        else{
          compare.push(body[index])
          // indexBody=0
          isReturn = false
          indexBody = 0 
          j++;
        }
       }
    }
    if(error){
      const comparer = (compare.length >=0 ?compare.slice(1):compare)
      hasAdded = hasAdded.filter(x=>comparer.length===0||comparer.some(c=>c===x))
    }
    else{
      error = false
      indexChild= 0
      hasAdded.push(...compare)
      indexBody = 0
      indexParent = 0
      teams.push([...compare])
    }
}
console.log('fin')
teams.forEach(x=>console.log(x))
let endTime = new Date();
var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
  console.log(seconds + " seconds in "+members.length +"s");
// console.log(paired)
