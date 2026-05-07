import { create } from "zustand";
import type { skills } from "./skills.config";

export const useHeroStore = create<State & Action>((set) => {
  return {
    skills: Array(8).fill(null),
    setSkill: (skill, idx) =>
      set((state) => {
        const clone = structuredClone(state.skills);

        clone[idx] = skill;

        return { skills: clone };
      }),
  };
});

type State = {
  skills: Skill[];
};

type Action = {
  setSkill: (skill: Skill, idx: IDX) => void;
};

export type IDX = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type SkillKey = keyof typeof skills;
export type SkillLvl = 0 | 1 | 2;

type Skill = {
  name: SkillKey;
  lvl: SkillLvl;
  info: string;
};
