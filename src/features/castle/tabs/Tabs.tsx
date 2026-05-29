import { useHistoryStore } from "#/features/history/history.store";
import Tab from "./tab/Tab";

const Tabs = () => {
  const castles = useHistoryStore((state) => {
    return state.castles;
  });

  return (
    <div>
      {Object.entries(castles).map(([uuid, castle]) => {
        if (!castle?.castleID) return null;

        return <Tab key={uuid} uuid={uuid} castleID={castle.castleID} />;
      })}
    </div>
  );
};

export default Tabs;
