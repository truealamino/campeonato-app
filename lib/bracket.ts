export function generateBracket(groupA: string[], groupB: string[]) {
  return {
    playin1: [groupA[1], groupB[2]],
    playin2: [groupB[1], groupA[2]],
    semifinal1: groupA[0],
    semifinal2: groupB[0],
  } as {
    playin1: [string, string];
    playin2: [string, string];
    semifinal1: string;
    semifinal2: string;
  };
}
