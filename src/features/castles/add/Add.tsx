import { useHistoryStore } from "#/features/history/history.store";
import {
  castles,
  secondaryCastlePreBuilds,
} from "#/routes/faction/castles.config";
import type { CastleID } from "#/routes/faction/$id";
import Button from "#/components/button/Button";
import Popover from "#/components/popover/Popover";
import css from "./add.module.css";

const castleIDs = Object.keys(castles) as CastleID[];

const Add = () => {
  const addCastle = useHistoryStore((state) => state.addCastle);

  const onAdd = (castleID: CastleID) =>
    addCastle(
      crypto.randomUUID(),
      castleID,
      castles[castleID],
      secondaryCastlePreBuilds[castleID],
    );

  return (
    <Popover>
      <Popover.Trigger>
        <Button>+</Button>
      </Popover.Trigger>

      <Popover.Content>
        {({ close }) => (
          <div className={css.options}>
            {castleIDs.map((castleID) => (
              <button
                key={castleID}
                type="button"
                className={css.option}
                data-testid={`add-${castleID}`}
                onClick={() => {
                  close();
                  onAdd(castleID);
                }}
              >
                <img
                  src={`/img/factions/logo/${castleID}.webp`}
                  alt={castleID}
                  className={css.icon}
                />
                <span className={css.label}>{castleID}</span>
              </button>
            ))}
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};

export default Add;
