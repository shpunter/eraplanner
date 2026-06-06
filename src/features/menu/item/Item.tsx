const Item = ({ label, id }: ItemProps) => {
  return (
    <div>
      <div>{label}</div>
      <div>{id}</div>
    </div>
  );
};

export default Item;

type ItemProps = {
  label: string;
  id: "castles" | "mines";
};
