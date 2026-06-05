import { useState } from "react";
import { useHistoryStore } from "#/features/history/history.store";
import { castles, secondaryCastlePreBuilds } from "#/routes/faction/castles.config";
import type { CastleID } from "#/routes/faction/$id";
import Button from "#/components/button/Button";
import Dropdown from "#/components/dropdown/Dropdown";

const castleOptions = (Object.keys(castles) as CastleID[]).map((castleID) => ({
  label: castleID,
  value: castleID,
}));

const Add = () => {
  const addCastle = useHistoryStore((state) => state.addCastle);
  const [selectedCastleID, setSelectedCastleID] = useState<CastleID>(
    castleOptions[0].value,
  );

  const onAdd = () => {
    const castleUUID = crypto.randomUUID();

    addCastle(
      castleUUID,
      selectedCastleID,
      castles[selectedCastleID],
      secondaryCastlePreBuilds[selectedCastleID],
    );
  };

  return (
    <div>
      <Dropdown
        options={castleOptions}
        value={selectedCastleID}
        onChange={setSelectedCastleID}
      />
      <Button onClick={onAdd}>+</Button>
    </div>
  );
};

export default Add;
