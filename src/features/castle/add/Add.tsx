import { useHistoryStore } from "#/features/history/history.store";
import { castles } from "#/routes/castle/castles.config";

const Add = () => {
  const addCastle = useHistoryStore((state) => state.addCastle);
  const castle = castles["hive"];

  const onClick = () => {
    const castleUUID = crypto.randomUUID();

    addCastle(castleUUID, "hive", castle, [
      "id10",
      "id01",
      "id05",
      "id06",
    ] as const);
  };

  return <div onClick={onClick}>add</div>;
};

export default Add;
