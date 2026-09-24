const fictionCategories = [
  {
    category: "TV Shows",
    items: [
      { title: "Breaking Bad", rating: "10/10" },
      { title: "Better Call Saul", rating: "10/10" },
      { title: "Daredevil", rating: "9.5/10" },
    ],
  },
  {
    category: "Animated Series",
    items: [
      { title: "Avatar: The Last Airbender", rating: "10/10" },
      { title: "Arcane", rating: "10/10" },
    ],
  },
  {
    category: "Movies",
    items: [
      { title: "Joker", rating: "9.5/10" },
      { title: "Interstellar", rating: "9.5/10" },
    ],
  },
  {
    category: "Animated Movies",
    items: [
      { title: "Spider-Man: Across the Spider-Verse", rating: "10/10" },
      { title: "Toy Story 3", rating: "9/10" },
    ],
  },
];

export default function Fiction() {
  return (
    <section className="section fiction">
      <h2 className="section__title">Favorite Fiction</h2>
      {fictionCategories.map((group) => (
        <div key={group.category} className="group">
          <h3 className="group__title">{group.category}</h3>
          <ul className="rating-list">
            {group.items.map((item) => (
              <li key={item.title} className="rating-item">
                <span className="rating-item__title">{item.title}</span>
                <span className="rating-item__score">{item.rating}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}