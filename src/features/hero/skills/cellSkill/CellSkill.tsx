import Modal, { type ModalHandle } from "#/components/modal/Modal";
import { useRef } from "react";
import SkillWithActions from "./skillWithActions/SkillWithActions";

import css from "./styles.module.css";
import { skills } from "../../skills.config";
import { useHeroStore, type IDX, type SkillKey } from "../../hero.store";
import Skill from "./skillWithActions/skill/Skill";
import { useShallow } from "zustand/react/shallow";

const CellSkill = ({ idx }: { idx: IDX }) => {
  const modalRef = useRef<ModalHandle>(null);
  const skill = useHeroStore(useShallow((state) => state.skills[idx]));

  const onClickFn = () => {
    modalRef.current?.showOnClick();
  };

  return (
    <>
      <div className={css.skill} onClick={onClickFn}>
        {skill && (
          <Skill
            name={skill.name}
            lvl={skill.lvl}
            img={skills[skill.name].info[skill.lvl].img}
          />
        )}
      </div>
      <Modal title="Select a skill" ref={modalRef}>
        <div className={css.list}>
          {Object.entries(skills).map(([key, value]) => {
            return (
              <SkillWithActions
                key={key}
                name={key as SkillKey}
                value={value}
                idx={idx}
              />
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default CellSkill;
