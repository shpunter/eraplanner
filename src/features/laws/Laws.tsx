import { Route } from "#/routes/faction/$id";
import { useEffect } from "react";
import Law from "./law/Law";
import { LAWS } from "./laws.config";
import { useLawsStore } from "./laws.store";
import css from "./laws.module.css";

const Laws = () => {
  const { id } = Route.useParams();
  const setConfig = useLawsStore((state) => state.setConfig);

  const groups = LAWS[id as keyof typeof LAWS] ?? [];

  useEffect(() => {
    setConfig(groups);
  }, [groups, setConfig]);

  return (
    <div className={css.laws}>
      {groups.map((group) => (
        <div key={group.map((law) => law.img).join()} className={css.group}>
          {group.map((law) => (
            <Law key={law.img} law={law} factionID={id} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Laws;
