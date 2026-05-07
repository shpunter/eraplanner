import type { TypeHero } from "#/routes/hero/$id";

const Info = ({ hName, hClass }: InfoProps) => {
  return (
    <>
      <p>{hName}</p>
      <p>{hClass}</p>
    </>
  );
};

export default Info;

type InfoProps = {
  hName: TypeHero["name"];
  hClass: TypeHero["class"];
};
