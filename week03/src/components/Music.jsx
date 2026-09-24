const musicGroups = [
  {
    category: "Bands",
    items: ["Twenty One Pilots", "Gorillaz", "Radiohead"],
  },
  {
    category: "Solo Artists",
    items: ["Tame Impala", "Kid Cudi", "Travis Scott"],
  },
];

const topAlbums = [
  { title: "Trench", artist: "Twenty One Pilots", year: "2018" },
  { title: "Demon Days", artist: "Gorillaz", year: "2005" },
  { title: "Blurryface", artist: "Twenty One Pilots", year: "2015" },
];

export default function Music() {
  return (
    <section className="section music">
      <h2 className="section__title">Music</h2>

      {musicGroups.map((group) => (
        <div key={group.category} className="group">
          <h3 className="group__title">{group.category}</h3>
          <ol className="artist-list">
            {group.items.map((artist, index) => (
              <li key={artist} className="artist-item">
                <span className="artist-item__rank">{index + 1}</span>
                <span className="artist-item__name">{artist}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}

      <div className="group">
        <h3 className="group__title">Favorite Albums</h3>
        <ol className="album-list">
          {topAlbums.map((album, index) => (
            <li key={album.title} className="album-item">
              <span className="album-item__rank">{index + 1}</span>
              <div className="album-item__info">
                <span className="album-item__title">{album.title}</span>
                <span className="album-item__meta">
                  {album.artist} · {album.year}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}