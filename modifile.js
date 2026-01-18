function createIdTeam(memberLength) {
  const members = [];
  for (let i = 0; i < memberLength; i++) {
    members.push(i);
  }
  return members;
}
function createTeamHeaderAndBody(members, limitTeam = 2) {
  const header = [];
  const body = [];
  let key = 0;
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      if (i == 0) {
        header.push({
          index: key,
          data: [members[i], members[j]],
          indexStater: [],
        });
      } else {
        body.push({ index: key, data: [members[i], members[j]] });
      }
      key++;
    }
  }

  // fix odd value
  header.forEach((x) => {
    while (x.indexStater.length < members.length / limitTeam - 1) {
      x.indexStater.push(0);
    }
  });
  return {
    header: header,
    body: body,
  };
}
async function createUniquePair({ header, body }, estimate, limitTeam) {
  return await new Promise((resolve, reject) => {
    try {
      const team = [];
      if (estimate == null || estimate > header.length - 1) {
        estimate = header.length;
      }
      for (let i = 0; i < header.length; i++) {
        if (team.length == estimate) {
          const result = team.map((x) => x.map((f) => f.data));
          return resolve(result);
        }
        const teamPair = [];
        teamPair.push(header[i]);
        const _filterPaired = body
          .filter(
            (x) => !x.data.some((s) => header[i].data.some((f) => f == s))
          )
          .filter((f) => !team.some((s) => s.some((g) => g.index == f.index)));
        let hasError = false;
        for (let index = 0; index < header[i].indexStater.length; index++) {
          let indexChild = header[i].indexStater[index];
          const filterPaired = _filterPaired.filter(
            (x) =>
              !x.data.some((g) =>
                teamPair.some((s) => s.data.some((f) => f == g))
              )
          );
          if (filterPaired.length <= indexChild) {
            if (header[i] == teamPair.pop()) {
              header[i - 1].indexStater[members.length / limitTeam - 2] += 1;
              header = header.map((x, indexP) =>
                indexP > i - 1
                  ? {
                      indexStater: x.indexStater.map((x) => 0),
                      data: x.data,
                      index: x.index,
                    }
                  : x
              );
              i -= 2;
              hasError = true;
              break;
            } else {
              header[i].indexStater[index - 1]++;
              header[i].indexStater = header[i].indexStater.map((x, indexP) =>
                indexP > index - 1 ? 0 : x
              );
              index -= 2;
            }
          } else {
            teamPair.push(filterPaired[indexChild]);
          }
        }
        if (!hasError) {
          team.push(teamPair);
        } else {
          team.pop();
        }
      }
      const result = team.map((x) => x.map((f) => f.data));
      resolve(result);
    } catch (ex) {
      console.log(ex);
      reject();
    }
  });
}
async function createPairTemplate(memberLength, limit, estimate = 4) {
  const ids = createIdTeam(memberLength);
  const template = createTeamHeaderAndBody(ids, limit);
  const result = await createUniquePair(template, estimate, limit);
  return result;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
async function createTeamPair(
  member,
  limitTeam,
  limit,
  start,
  random,
  memberLock = []
) {
  return await new Promise(async (resolve, reject) => {
    try {
      const cateria = {
        memberLength: member.length,
        limit: limit,
        start: start,
        random: random,
      };
      const result = (
        await createPairTemplate(
          cateria.memberLength,
          limitTeam,
          cateria.limit ?? null
        )
      ).filter((_, index) => index + 1 > cateria.start);
      const ids = [];
      result.forEach((x) => {
        x.forEach((y) => {
          y.forEach((v) => {
            if (ids.findIndex((fid) => fid == v) == -1) {
              ids.push(v);
            }
          });
        });
      });
      if (cateria.random) {
        member = shuffleArray(member);
      }
      const memberList = ids.map((x, index) => {
        return { name: member[index] ?? `nodata Name ${x}`, value: x };
      });
      const mapUserIdAndName =
        result.map((x) =>
          x.map((g) => g.map((c) => memberList.find((f) => f.value == c).name))
        ) ?? [];
      let response = [];
      mapUserIdAndName.forEach((teamPaired) => {
        response.push(shuffleArray(teamPaired));
      });
      if (memberLock.length > 0) {
        response = [];
        memberLock.forEach((teamLock) => {
          mapUserIdAndName.forEach((teamPaired) => {
            teamPaired.push(teamLock);
            response.push(shuffleArray(teamPaired));
          });
        });
      }
      resolve(response);
    } catch (ex) {
      console.log(ex);
      reject();
    }
  });
}
module.exports = { createTeamPair };
// function main() {
//   let member = [
//     "prem",
//     "ten",
//     "non",
//     "not",
//     "day",
//     "bam",
//     "game",
//     "rin",
//     "dofe",
//     "mark",
//     "ood",
//     "may",
//     "rug",
//     "win",
//     "mawin",
//     "hen",
//     "us",
//     "fish",
//     "goom",
//     "gem",
//   ];
//   const memberLock = [["ggkk", "jjj"]];
//   createTeamPair(member, member.length, 0, true, memberLock)
//     .then((x) => console.log(x))
//     .catch((x) => console.log(x));
// }
// main();
