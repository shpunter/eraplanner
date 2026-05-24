import { useHistoryStore, type Mine as TMine } from "../history/history.store";
import Mine from "./mine/Mine";

const Mines = () => {
  const addMine = useHistoryStore((state) => state.addMine);

  const onClick = (mine: TMine) => () => {
    addMine(mine);
  };

  return (
    <div>
      {(["gold", "ore", "wood", "crystal", "gem", "mercury"] as const).map(
        (item) => {
          return <Mine key={item} type={item} onClick={onClick(item)} />;
        },
      )}
    </div>
  );
};

export default Mines;
