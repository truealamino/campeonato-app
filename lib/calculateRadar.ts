type Evaluation = {
  skill: string;
  rating: number;
};

const skillsLinha = [
  "visao",
  "controle",
  "finalizacao",
  "velocidade",
  "desarme",
  "drible",
];

const skillsGol = [
  "reposicao",
  "comunicacao",
  "posicionamento",
  "reflexo",
  "jogoAereo",
  "agilidade",
];

export function calculateRadar(evaluations: Evaluation[], position: string) {
  const isGoalkeeper = position?.toLowerCase().includes("gol");

  const skills = isGoalkeeper ? skillsGol : skillsLinha;

  return skills.map((skill) => {
    const skillRatings = evaluations
      .filter((e) => e.skill === skill)
      .map((e) => e.rating);

    if (skillRatings.length === 0) {
      return { skill, value: 0 };
    }

    const avg =
      skillRatings.reduce((sum, v) => sum + v, 0) / skillRatings.length;

    return {
      skill: skill.charAt(0).toUpperCase() + skill.slice(1),
      value: Math.round((avg / 5) * 100),
    };
  });
}
