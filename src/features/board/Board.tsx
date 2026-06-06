import History from "../history/History";
import Resources from "../resources/Resources";
import CastleBoard from "../castles/CastleBoard";
import Menu from "../menu/Menu";

import css from "./board.module.css";

const Board = () => {
  return (
    <div className={css.board}>
      <div className={css.header}>
        <Resources />
      </div>
      <div className={css.history}>
        <History />
      </div>
      <div className={css.navigation}>
        <Menu />
      </div>
      <div className={css.main}>
        <CastleBoard />
      </div>
    </div>
  );
};

export default Board;
