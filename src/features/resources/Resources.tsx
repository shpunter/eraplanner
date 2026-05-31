import { useResourceTimeline } from "./useResourceTimeline";
import { RESOURCE_KEYS } from "./resources.utils";
import css from "./styles.module.css";

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
