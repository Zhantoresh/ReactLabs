const contacts = [
  {
    label: "GitHub",
    value: "@Zhantoresh",
    href: "https://github.com/Zhantoresh",
  },
  {
    label: "Address",
    value: "Planet Earth",
    href: null,
  },
];

export default function Contact() {
  return (
    <section className="section contact">
      <h2 className="section__title">Contact</h2>
      <ul className="contact__list">
        {contacts.map((c) => (
          <li key={c.label} className="contact__item">
            <span className="contact__label">{c.label}</span>
            {c.href ? (
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="contact__value"
              >
                {c.value}
              </a>
            ) : (
              <span className="contact__value">{c.value}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}