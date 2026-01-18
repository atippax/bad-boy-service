function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
function shufferMember(member) {
  for (let i = member.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [member[i], member[j]] = [member[j], member[i]];
  }
  return member;
}
function createRandomTeamParing(member, teamLock, limit = 2) {
  const result = [];
  member.forEach((x) => {
    if (result.length == 0) {
      result.push([x]);
    } else if (result[result.length - 1].length < limit) {
      result[result.length - 1].push(x);
    } else {
      result.push([x]);
    }
  });
  teamLock.forEach((x) => {
    result.push(x.teamMember);
  });
  return shufferMember(result);
}
function randomTeam(members, history) {
  const hasPaired = [];
  const team = [];
  members.forEach((e) => {
    if (hasPaired.some((s) => s == e)) {
      return;
    }
    const oldMember = findOldMember(e, history);
    const canpair = members
      .filter((x) => !oldMember.some((s) => s == x) && x != e)
      .filter((f) => !hasPaired.some((s) => s == f));
    const temp = [e];
    if (canpair.length > 0) {
      const index = Math.floor(Math.random() * canpair.length);
      temp.push(canpair[index]);
    }
    hasPaired.push(...temp);
    team.push(temp);
  });
  return team;
}
function findOldMember(e, _histories) {
  const oldMember = [];
  const histories = JSON.parse(JSON.stringify(_histories));
  histories.forEach((h) => {
    const filter = h.filter((x) => x.some((s) => s == e));
    if (filter.length <= 0) {
      return;
    }
    const paired = filter.flatMap((x) => x).filter((x) => x != e);
    if (paired.length >= 1) {
      oldMember.push(paired);
    }
  });
  return oldMember;
}
module.exports = { createRandomTeamParing };
