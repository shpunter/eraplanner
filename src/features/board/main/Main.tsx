import { useMatch } from "@tanstack/react-router";
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
  const isCastles = !!useMatch({
    from: "/faction/$id/castles",
    shouldThrow: false,
  });
  const isMines = !!useMatch({
    from: "/faction/$id/mines",
    shouldThrow: false,
  });
  const isResources = !!useMatch({
    from: "/faction/$id/resources",
    shouldThrow: false,
  });
  const isLaw = !!useMatch({ from: "/faction/$id/law", shouldThrow: false });

  return (
    <>
      <div hidden={!isCastles}>
        <CastleBoard />
      </div>
      <div hidden={!isMines}>
        <Mines />
      </div>
      <div hidden={!isResources}>
        <Resources />
      </div>
      <div hidden={!isLaw}>
        <Law />
      </div>
    </>
  );
};

export default Main;
