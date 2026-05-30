import { useHistoryStore } from "#/features/history/history.store";
import type { CastleID } from "#/routes/castle/$id";
import { classnames } from "#/shared/classnames";
import css from "./styles.module.css";

const Tab = ({ uuid, castleID }: { uuid: string; castleID: CastleID }) => {
  const currCastleUUID = useHistoryStore((state) => state.currCastleUUID);
  const setActiveTab = useHistoryStore((state) => state.setActiveTab);
  const isDisabled = useHistoryStore((state) => {
    return state.history[uuid]?.disabled[state.historyIDX] ?? false;
  });

  const classNames = classnames({ [css.active]: currCastleUUID === uuid });

  const onClick = () => {
    setActiveTab(uuid);
  };

  return isDisabled ? null : (
    <div key={uuid} className={classNames} onClick={onClick}>
      {castleID}, {uuid}
    </div>
  );
};

export default Tab;
