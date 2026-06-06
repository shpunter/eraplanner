import Menu from "#/components/menu/Menu";
import Item from "./item/Item";

const ITEMS = [
  { id: "castles", label: "Castles" },
  { id: "mines", label: "Mines" },
] as const;

const BoardMenu = () => {
  return (
    <Menu defaultValue="castles">
      {ITEMS.map(({ id, label }) => (
        <Menu.Item key={id} value={id}>
          <Item label={label} id={id} />
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default BoardMenu;
