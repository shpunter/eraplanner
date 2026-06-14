import { useEffect } from "react";
import { useHistoryStore } from "#/features/history/history.store";
import { emit, patchDown } from "#/shared/minesBus";
import { CreateRemoteComponent } from "#/features/menu/CreateRemoteComponent";
import Button from "#/components/button/Button";
import css from "./mines.module.css";
import Loading from "#/components/mfe/loading/Loading";
import NotConfigured from "#/components/mfe/notConfigured/NotConfigured";

const RemoteApp = CreateRemoteComponent(() => import("mines/App"), {
  loading: <Loading />,
  error: NotConfigured,
});

const Mines = () => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  useEffect(() => {
    patchDown({ historyIDX });
  }, [historyIDX]);

  const onClick = () => emit({ type: "mines:reset-all" });

  return (
    <section className={css.mines}>
      <Button size="sm" className={css.reset} onClick={onClick}>
        Reset
      </Button>
      <RemoteApp />
    </section>
  );
};

export default Mines;
