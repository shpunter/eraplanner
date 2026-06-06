import { Route } from "#/routes/faction/$id";
import CastleBoard from "#/features/castles/CastleBoard";
import Mines from "#/features/mines/Mines";

const Main = () => {
  const { m } = Route.useSearch();

  return m === "mines" ? <Mines /> : <CastleBoard />;
};

export default Main;
