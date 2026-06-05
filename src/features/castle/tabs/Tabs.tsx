import Tabs from "#/components/tabs/Tabs";
import { useHistoryStore } from "#/features/history/history.store";
import css from "./tabs.module.css";

const CastleTabs = () => {
  const castles = useHistoryStore((state) => state.castles);
  const history = useHistoryStore((state) => state.history);
  const historyIDX = useHistoryStore((state) => state.historyIDX);
  const currCastleUUID = useHistoryStore((state) => state.currCastleUUID);
  const setActiveTab = useHistoryStore((state) => state.setActiveTab);

  return (
    <Tabs value={currCastleUUID} onChange={setActiveTab}>
      {Object.entries(castles).map(([uuid, castle]) => {
        if (!castle?.castleID) return null;

        const isDisabled = history[uuid]?.disabled[historyIDX] ?? false;
        if (isDisabled) return null;

        const hasChange = !!history[uuid]?.built?.[historyIDX];

        return (
          <Tabs.Tab key={uuid} value={uuid} indicator={hasChange}>
            <div className={css.item}>
              <img
                src={`/img/factions/logo/${castle.castleID}.webp`}
                alt={castle.castleID}
                className={css.logo}
              />
              <div>{castle.castleID}</div>
            </div>
          </Tabs.Tab>
        );
      })}
    </Tabs>
  );
};

export default CastleTabs;
