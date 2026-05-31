import { useResourceTimeline } from "./useResourceTimeline";
import css from "./styles.module.css";
import { RESOURCE_KEYS } from "#/shared/constants";

const Resources = () => {
  const { available, incomePerDay } = useResourceTimeline();

  return (
    <div className={css.wrapper}>
      {RESOURCE_KEYS.map((key) => (
        <div key={key}>
          <div>
            {key}: {available[key]}
          </div>
          <div>+{incomePerDay[key]}</div>
        </div>
      ))}
    </div>
  );
};

export default Resources;
