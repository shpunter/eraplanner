import css from "./seoSection.module.css";

export default function SeoSection({ heading, lead, items }: Props) {
  return (
    <section className={css.section}>
      <h2 className={css.heading}>{heading}</h2>
      <p className={css.lead}>{lead}</p>
      {items && (
        <ul className={css.grid}>
          {items.map((item) => (
            <li key={item.name} className={css.item}>
              <strong className={css.name}>{item.name}</strong>
              <span className={css.desc}>{item.description}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

type SeoItem = { readonly name: string; readonly description: string };

type Props = {
  heading: string;
  lead: string;
  items?: readonly SeoItem[];
};
