import Menu from "#/components/menu/Menu";
import NavMenuItem from "#/components/menu/item/NavMenuItem";
import { Route, TAB_ROUTES } from "#/routes/faction/$id";
import Item from "./item/Item";

const ITEMS = [
  { id: "castles", label: "Castles" },
  { id: "mines", label: "Mines" },
  { id: "resources", label: "Resources" },
  { id: "law", label: "Law" },
] as const;

const BoardMenu = () => {
  const { id } = Route.useParams();

  return (
    <Menu>
      {ITEMS.map(({ id: tab, label }) => (
        <NavMenuItem key={tab} to={TAB_ROUTES[tab]} params={{ id }}>
          <Item label={label} id={tab} />
        </NavMenuItem>
      ))}
    </Menu>
  );
};

export default BoardMenu;
