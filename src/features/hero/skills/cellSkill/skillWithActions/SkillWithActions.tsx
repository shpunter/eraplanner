import type { skills } from "#/features/hero/skills.config";
import css from "./styles.module.css";
import {
  useHeroStore,
  type IDX,
  type SkillKey,
  type SkillLvl,
} from "#/features/hero/hero.store";
import Skill from "./skill/Skill";

const SkillWithActions = ({ name, value, idx }: SkillProps) => {
  const setSkill = useHeroStore((state) => state.setSkill);
  const skillInTheStore = useHeroStore((state) =>
    state.skills.find((skill) => skill?.name === name),
  );
  const isDisabled = useHeroStore((state) =>
    state.skills.some((skill, i) => skill?.name === name && idx !== i),
  );
  const skillId = `skill-${name}`;
  const skillLvl = skillInTheStore?.lvl ?? 2;

  const increaseLvl = () => {
    if (isDisabled) return;

    const lvl = Math.max(skillLvl + 1, 0) as SkillLvl;

    setSkill({ name, info: value.info[lvl].description, lvl }, idx);
  };

  const decreaseLvl = () => {
    if (isDisabled) return;

    const lvl = Math.max(skillLvl - 1, 0) as SkillLvl;

    setSkill({ name, info: value.info[lvl].description, lvl }, idx);
  };

  const onSkillClick = () => {
    if (isDisabled) return;

    const lvl = skillLvl as SkillLvl;

    setSkill({ name, info: value.info[skillLvl].description, lvl }, idx);
  };

  return (
    <>
      <div
        key={name}
        className={isDisabled ? `${css.item} ${css.disabled}` : css.item}
      >
        <div onClick={onSkillClick}>
          <Skill name={name} lvl={skillLvl} img={value.info[skillLvl].img} />
        </div>
        <div className={css["item-actions"]}>
          <button
            type="button"
            className={css.i}
            popoverTarget={skillId}
            style={
              {
                "--item-anchor": `--anchor-${skillId}`,
              } as React.CSSProperties
            }
          >
            i
          </button>
          <div>
            <button
              type="button"
              onClick={increaseLvl}
              className={css.action}
              disabled={skillLvl >= 2}
            >
              +
            </button>
            <button
              type="button"
              onClick={decreaseLvl}
              className={css.action}
              disabled={skillLvl <= 0}
            >
              -
            </button>
          </div>
        </div>
      </div>
      <div
        id={skillId}
        popover="auto"
        className={css["tooltip-box"]}
        style={
          {
            "--item-anchor": `--anchor-${skillId}`,
          } as React.CSSProperties
        }
      >
        <div className={css.info}>{value.info[skillLvl].description}</div>
      </div>
    </>
  );
};

export default SkillWithActions;

type SkillProps = {
  name: SkillKey;
  value: (typeof skills)[SkillKey];
  idx: IDX;
};
