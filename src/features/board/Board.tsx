import History from "../history/History";
import ResourceBar from "../resourceBar/ResourceBar";
import Menu from "../menu/Menu";
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
      </div>
      <div className={css.main}>
        <Main />
      </div>
    </div>
  );
};

export default Board;
