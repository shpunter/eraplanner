import History from "../history/History";
import ResourceBar from "../resourceBar/ResourceBar";
import ShareImportModal from "../share/ShareImportModal";
import Menu from "../menu/Menu";
import FactionPicker from "./factionPicker/FactionPicker";
import css from "./board.module.css";
import Main from "./main/Main";

const Board = () => {
  return (
    <div className={css.board}>
      <div className={css.header}>
        <ResourceBar />
      </div>
      <div className={css.history}>
        <History />
      </div>
      <div className={css.navigation}>
        <Menu />
        <FactionPicker />
      </div>
      <div className={css.main}>
        <Main />
      </div>
      <ShareImportModal />
    </div>
  );
};

export default Board;
