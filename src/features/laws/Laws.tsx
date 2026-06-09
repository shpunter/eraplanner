import { Route } from "#/routes/faction/$id";
import { useEffect } from "react";
import Law from "./law/Law";
import { LAW_LAYOUT, LAWS } from "./laws.config";
import { useLawsStore } from "./laws.store";
import css from "./laws.module.css";

const Laws = () => {
  const { id } = Route.useParams();
  const setConfig = useLawsStore((state) => state.setConfig);

  const laws = LAWS[id as keyof typeof LAWS];
  const layout = LAW_LAYOUT[id as keyof typeof LAW_LAYOUT] ?? [];

  useEffect(() => {
    if (laws) setConfig(laws);
  }, [laws, setConfig]);

  if (!laws) return null;

  return (
    <div className={css.laws}>
      <div className={css.scroll}>
        <div className={`${css.side} ${css.left}`}>
          {layout.left.map((group) => (
            <div key={group.join()} className={css.group}>
              {group.map((lawID) => (
                <Law key={lawID} law={laws[lawID]} factionID={id} />
              ))}
            </div>
          ))}
        </div>
        <div className={`${css.side} ${css.right}`}>
          {layout.right.map((group) => (
            <div key={group.join()} className={css.group}>
              {group.map((lawID) => (
                <Law key={lawID} law={laws[lawID]} factionID={id} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Laws;
