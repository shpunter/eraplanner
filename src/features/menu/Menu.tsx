import Menu from "#/components/menu/Menu";
import { Route } from "#/routes/faction/$id";
import Item from "./item/Item";

const ITEMS = [
  { id: "castles", label: "Castles" },
  { id: "mines", label: "Mines" },
  { id: "resources", label: "Resources" },
] as const;

const BoardMenu = () => {
  const { m } = Route.useSearch();
  const navigate = Route.useNavigate();

  const onChange = (value: (typeof ITEMS)[number]["id"]) => {
    navigate({ search: (prev) => ({ ...prev, m: value }) });
  };

  return (
    <Menu value={m} onChange={onChange}>
      {ITEMS.map(({ id, label }) => (
        <Menu.Item key={id} value={id}>
          <Item label={label} id={id} />
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default BoardMenu;
