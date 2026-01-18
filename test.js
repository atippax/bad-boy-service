const { appendFileSync } = require('fs');
const createfile = false;
const openConsole = true;
const origConsole = globalThis.console;
const console = {
    log: (...args) => {
      if(createfile){
        appendFileSync(`./resultPair${new Date()}.txt`, args.join('\n') + '\n');
      }
      if(openConsole){
        return origConsole.log.apply(origConsole, args);
      }
    }
}
async function Cal(pairs) {
  return await new Promise((resolve, reject) => {
    try {
      console.log('start pairing')
      const members = []
      for (let i = 0; i < pairs; i++) {
        members.push(i)
      }
      const limitTeam = 2
      const pair = []
      let teamHeader = []
      let key = 0
      for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
          if (i == 0) {
            teamHeader.push({ index: key, data: [members[i], members[j]], indexStater: [] })
          }
          else {
            pair.push({ index: key, data: [members[i], members[j]] })
          }
          key++
        }
      }
      const team = []
      teamHeader.forEach(x => {
        while (x.indexStater.length < (members.length / limitTeam)-1) {
          x.indexStater.push(0)
        }
      })
      // teamHeader.sort().reverse()
      for (let i = 0; i < teamHeader.length; i++) {
        console.log(`start pair ${i+1}`)
        const teamPair = []
        teamPair.push(teamHeader[i])
        const _filterPaired = pair.filter(x => !x.data.some(s => teamHeader[i].data.some(f => f == s))).filter(f => !team.some(s => s.some(g => g.index == f.index)))
        let hasError = false
        let removeTeam = 0
        teamHeader[i].data.forEach(x=>{
          const len = pair.filter(f=>f.data.some(s=>s==x)).length
          removeTeam+=len;
          // team.forEach(g=>{
          //   const leng = g.filter(f=>f.data.some(s=>s==x) && f.indexStater == undefined).length
          //   removeTeam+=leng;
          // })
        }) 
        
        const limitMaxTeam = (members.length/2)-1
        const maxp = (limitMaxTeam*(pairs-1))
        const removeDup = (team.length*(limitMaxTeam-1))
        const allPosibleLength =maxp-(removeTeam)-removeDup
        // (pair.length-removeTeam)-(team.length*limitMaxTeam);
        let dataIsEnough = true
        if(_filterPaired.length < allPosibleLength ){
          console.log('error')
          dataIsEnough = false
        }

        for (let index = 0; index < teamHeader[i].indexStater.length; index++) {
          // console.log(i,index,teamHeader[i].indexStater[index])
          let indexChild = teamHeader[i].indexStater[index]
          if(!dataIsEnough){
            indexChild = Infinity
          }
          const filterPaired = _filterPaired.filter(x => !x.data.some(g => teamPair.some(s => s.data.some(f => f == g))))
          // if(i>=16 && index==0){
          //   console.log(`pair ${i+1} has ${filterPaired.length} routes. now current route ${indexChild} `);
          // }
         
// ********* VVVV dev only VVVV *********
          // if (i === 17 && first17) {
          //   indexChild = 99999
          //   teamHeader[i].indexStater[index] = 16
          //   indexChild = 16
          //   first17 = false
          // }
// ********* ^^^^ dev only ^^^^ *********
          // let isd = 0
          // if (filterPaired.length >= 18 && i == 17) {
          //   lsd = 0
          // }
// ********* VVVV dev only VVVV *********

          // if(i == 17 && index<2){
          //   console.log(i,index, "["+teamHeader[i].indexStater[0]+']',"timer "+pairs+"member use " + (new Date()-startTime)/1000 + " seconds Go back to the previous pair.")
          // }
          // if (index == 0 && i == 17 && indexChild == (filterPaired.length - 1)) {
          //   isd = 1;
          //   ;
          // }
// ********* ^^^^ dev only ^^^^ *********
          if (filterPaired.length <= indexChild) {
            if (teamHeader[i] == teamPair.pop()) {
              console.log(`old ! pair ${i} and index value = [${teamHeader[i-1].indexStater.join(',')}]`);
              teamHeader[i - 1].indexStater[(members.length / limitTeam) - 2] += 1
              // teamHeader = teamHeader.map((x,indexP)=>{
              //   if(indexP>i){
              //     x.indexStater.map(x=>0)
              //   }
              // })
              teamHeader = teamHeader.map((x, indexP) => (indexP > i - 1) ? { indexStater: x.indexStater.map(x => 0), data: x.data, index: x.index }:x)
              console.log(`new ! pair ${i} and index value = [${teamHeader[i-1].indexStater.join(',')}]`);
              console.log(`back pair form ${i+1} to ${i} `)
              i -= 2
              hasError = true
              break
            }
            else {
              teamHeader[i].indexStater[index - 1]++
              // teamHeader[i].indexStater.filter((x,indexk)=>indexk>index-1).forEach(x=>x=0)
              teamHeader[i].indexStater = teamHeader[i].indexStater.map((x, indexP) => indexP > index - 1 ?0: x)
              index -= 2
              // console.log(i, "["+teamHeader[i].indexStater.join(',')+']',"timer "+pairs+"member use " + (new Date()-startTime)/1000 + " seconds Go back to the previous pair.")
            }
          }
          else {
            teamPair.push(filterPaired[indexChild])
          }
        }
        if (!hasError) {
          console.log(`pair ${i+1} is success`)
          team.push(teamPair)
        }
        else {
          team.pop()
          console.log(`pair ${i+2} is error restart ${i} again`)
        }
      }
      const teamFinish = team.map(x => x.map(f => f.data))
      console.log('recheck')
      for (let index = 0; index < team.length + 1; index++) {
        let summation = 0
        const data = teamFinish.map(x => x.find(f => f.some(s => s == index)))
        data.forEach(x => {
          summation += parseInt([...x.filter(f => f != index)])
        })
        console.log(index+" => ",summation+index);
      }
      resolve(teamFinish)
    }
    catch(ex) {
      console.log(ex)
      reject()
    }
  })
}

async function main() {
  const member = ["prem","ten",'non','not','day','bam','game','rin','dofe','mark','ood','may','rug','win','mawin','hen','us','fish','goom','gem']
  const cateria = [4,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,6,6,6,6,6,8,8,8,8,8,8,8,8,8,8,10,10,10,10,10,10,10,10,10,10,10,12,12,12,12,12,12,12,12,12,12,12,14,14,14,14,14,14,14,14,14,14,14,14,16,16,16,16,16,16,16,16,16,16,16,16,16,18,18,18,18,18,18,18,18,18,18,18,18,18]
  // for (let index = 0; index < cateria.length; index++) {
  //   console.log('result',Cal(cateria[index]))
  // }
  // await cateria.forEach(async x=>{
  //     let dateStart = new Date()
  //     Cal(x).then(y=>{
  //       console.log(`${x} members used ${(new Date()-dateStart)/1000} sec.`)
  //     })
  // })

      let dateStart = new Date()
      console.log(dateStart);
      Cal(20).then(y=>{
        let dateEnd  = new Date()

        console.log('\n')
        // console.log(JSON.stringify(y))
        console.log('\n')

        console.log(`${6} members used ${(dateEnd-dateStart)/1000} sec.`)
        console.log(dateEnd);
        const memberList = member.map((x,index)=>{return{name:x,value:index}})
// console.log(memberList)
const a = y.map(x=>{
    return x.map(g=>{
        // console.log(g)
        return g.map(c=>memberList.find(f=>f.value==c).name)
    })
})
a.forEach(x=>{
    console.log(x)
})
      })
      // dateStart = new Date()
      // Cal(20).then(y=>{
      //   console.log(`${x} members used ${(new Date()-dateStart)/1000} sec.`)
      // })
}

main().then(x=>{})


