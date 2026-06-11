import { Route } from "#/routes/faction/$id";
import CastleBoard from "#/features/castles/CastleBoard";
import Mines from "#/features/mines/Mines";
import Resources from "#/features/resources/Resources";
import Law from "#/features/law/Law";

const Main = () => {
  const { m } = Route.useSearch();

  if (m === "mines") return <Mines />;
  if (m === "resources") return <Resources />;
  if (m === "law") return <Law />;

  return <CastleBoard />;
};

export default Main;
