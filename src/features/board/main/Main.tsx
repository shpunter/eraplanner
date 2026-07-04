import { Route } from "#/routes/faction/$id";
import CastleBoard from "#/features/castles/CastleBoard";
import Mines from "#/features/mines/Mines";
import Resources from "#/features/resources/Resources";
import Law from "#/features/law/Law";

// All four remotes are mounted at all times so they each hydrate their IDB
// store and publish up-to-date history to the bus. ResourceBar reads from all
// four buses simultaneously — if a remote is unmounted its history goes stale.
// MF already fetches all remote entries at startup anyway, so keeping the
// React trees alive adds no extra network cost.
const Main = () => {
  const { m } = Route.useSearch();

  return (
    <>
      <div hidden={m !== "castles"}>
        <CastleBoard />
      </div>
      <div hidden={m !== "mines"}>
        <Mines />
      </div>
      <div hidden={m !== "resources"}>
        <Resources />
      </div>
      <div hidden={m !== "law"}>
        <Law />
      </div>
    </>
  );
};

export default Main;
