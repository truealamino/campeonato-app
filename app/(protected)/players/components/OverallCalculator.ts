export type SkillType =
  | "visao"
  | "controle"
  | "finalizacao"
  | "velocidade"
  | "desarme"
  | "drible"
  | "reposicao"
  | "comunicacao"
  | "posicionamento"
  | "reflexo"
  | "jogoAereo"
  | "agilidade";

export type Evaluation = {
  self: number; // 1 a 5
  org1: number; // 5 a 10
  org2: number;
  org3: number;
  org4: number;
};

export function calculateOverall(evaluations: Record<SkillType, Evaluation>) {
  const skills = Object.values(evaluations);

  const totalSum = skills.reduce((acc, skill) => {
    const skillSum =
      skill.self + skill.org1 + skill.org2 + skill.org3 + skill.org4;

    return acc + skillSum;
  }, 0);

  const average = totalSum / 6;

  const overall = 50 + average;

  return Math.round(overall);
}
