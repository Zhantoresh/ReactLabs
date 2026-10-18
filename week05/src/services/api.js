const MOVIES_DATA = [
  { id: 1, title: "The Shawshank Redemption", genre: "Drama", year: 1994, rating: 9.3, director: "Frank Darabont", duration: 142, poster: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption." },
  { id: 2, title: "The Godfather", genre: "Drama", year: 1972, rating: 9.2, director: "Francis Ford Coppola", duration: 175, poster: "https://image.tmdb.org/t/p/w1280/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son." },
  { id: 3, title: "The Dark Knight", genre: "Action", year: 2008, rating: 9.0, director: "Christopher Nolan", duration: 152, poster: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg", description: "When the menace known as the Joker wreaks havoc and chaos, Batman must accept new tests." },
  { id: 4, title: "Pulp Fiction", genre: "Thriller", year: 1994, rating: 8.9, director: "Quentin Tarantino", duration: 154, poster: "https://image.tmdb.org/t/p/w1280/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg", description: "The lives of two mob hitmen, a boxer, and a gangster's wife intertwine in tales of violence." },
  { id: 5, title: "Inception", genre: "Sci-Fi", year: 2010, rating: 8.8, director: "Christopher Nolan", duration: 148, poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", description: "A thief who steals corporate secrets through dream-sharing technology is given a final task." },
  { id: 6, title: "Fight Club", genre: "Drama", year: 1999, rating: 8.8, director: "David Fincher", duration: 139, poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", description: "An insomniac office worker and a soap maker form an underground fight club." },
  { id: 7, title: "Forrest Gump", genre: "Drama", year: 1994, rating: 8.8, director: "Robert Zemeckis", duration: 142, poster: "https://image.tmdb.org/t/p/w1280/saHP97rTPS5eLmrLQEcANmKrsFl.jpg", description: "The presidencies of Kennedy and Johnson unfold from the perspective of an Alabama man." },
  { id: 8, title: "Interstellar", genre: "Sci-Fi", year: 2014, rating: 8.7, director: "Christopher Nolan", duration: 169, poster: "https://image.tmdb.org/t/p/w1280/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { id: 9, title: "The Matrix", genre: "Sci-Fi", year: 1999, rating: 8.7, director: "Lana Wachowski", duration: 136, poster: "https://image.tmdb.org/t/p/w1280/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg", description: "A computer hacker learns from mysterious rebels about the true nature of his reality." },
  { id: 10, title: "Goodfellas", genre: "Drama", year: 1990, rating: 8.7, director: "Martin Scorsese", duration: 145, poster: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg", description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife." },
  { id: 11, title: "Se7en", genre: "Thriller", year: 1995, rating: 8.6, director: "David Fincher", duration: 127, poster: "https://image.tmdb.org/t/p/w1280/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg", description: "Two detectives hunt a serial killer who uses the seven deadly sins as his motives." },
  { id: 12, title: "The Silence of the Lambs", genre: "Thriller", year: 1991, rating: 8.6, director: "Jonathan Demme", duration: 118, poster: "https://image.tmdb.org/t/p/w1280/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg", description: "A young F.B.I. cadet must receive the help of an incarcerated cannibal killer." },
  { id: 13, title: "Spirited Away", genre: "Animation", year: 2001, rating: 8.6, director: "Hayao Miyazaki", duration: 125, poster: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", description: "During her family's move, a sullen girl wanders into a world ruled by gods and spirits." },
  { id: 14, title: "Saving Private Ryan", genre: "Action", year: 1998, rating: 8.6, director: "Steven Spielberg", duration: 169, poster: "https://image.tmdb.org/t/p/w1280/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg", description: "Following Normandy, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper." },
  { id: 15, title: "Parasite", genre: "Thriller", year: 2019, rating: 8.5, director: "Bong Joon Ho", duration: 132, poster: "https://image.tmdb.org/t/p/w1280/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", description: "Greed and class discrimination threaten the newly formed symbiotic relationship." },
  { id: 16, title: "Gladiator", genre: "Action", year: 2000, rating: 8.5, director: "Ridley Scott", duration: 155, poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", description: "A former Roman General sets out to exact vengeance against the corrupt emperor." },
  { id: 17, title: "Whiplash", genre: "Drama", year: 2014, rating: 8.5, director: "Damien Chazelle", duration: 107, poster: "https://image.tmdb.org/t/p/w1280/7fn624j5lj3xTme2SgiLCeuedmO.jpg", description: "A promising young drummer enlists at a cut-throat music conservatory." },
  { id: 18, title: "The Prestige", genre: "Sci-Fi", year: 2006, rating: 8.5, director: "Christopher Nolan", duration: 130, poster: "https://image.tmdb.org/t/p/w1280/Ag2B2KHKQPukjH7WutmgnnSNurZ.jpg", description: "Two stage magicians engage in a bitter battle to create the ultimate illusion." },
  { id: 19, title: "The Lion King", genre: "Animation", year: 1994, rating: 8.5, director: "Roger Allers", duration: 88, poster: "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg", description: "Lion prince Simba and his father are targeted by his bitter uncle." },
  { id: 20, title: "Back to the Future", genre: "Sci-Fi", year: 1985, rating: 8.5, director: "Robert Zemeckis", duration: 116, poster: "https://image.tmdb.org/t/p/w1280/vN5B5WgYscRGcQpVhHl6p9DDTP0.jpg", description: "Marty McFly is accidentally sent thirty years into the past in a time-traveling DeLorean." },
  { id: 21, title: "Oppenheimer", genre: "Drama", year: 2023, rating: 8.9, director: "Christopher Nolan", duration: 180, poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", description: "The story of American scientist J. Robert Oppenheimer and the atomic bomb." },
  { id: 22, title: "Dune: Part Two", genre: "Sci-Fi", year: 2024, rating: 8.6, director: "Denis Villeneuve", duration: 166, poster: "https://image.tmdb.org/t/p/w1280/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg", description: "Paul Atreides unites with Chani and the Fremen while seeking revenge." },
  { id: 23, title: "Spider-Man: Across the Spider-Verse", genre: "Animation", year: 2023, rating: 8.7, director: "Joaquim Dos Santos", duration: 140, poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", description: "Miles Morales catapults across the Multiverse to protect its very existence." },
  { id: 24, title: "WALL-E", genre: "Animation", year: 2008, rating: 8.4, director: "Andrew Stanton", duration: 98, poster: "https://image.tmdb.org/t/p/w1280/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg", description: "A small waste-collecting robot embarks on a space journey that decides mankind's fate." },
  { id: 25, title: "The Shining", genre: "Thriller", year: 1980, rating: 8.4, director: "Stanley Kubrick", duration: 146, poster: "https://image.tmdb.org/t/p/w1280/uAR0AWqhQL1hQa69UDEbb2rE5Wx.jpg", description: "A family heads to an isolated hotel where a sinister presence influences the father." },
  { id: 26, title: "Coco", genre: "Animation", year: 2017, rating: 8.4, director: "Lee Unkrich", duration: 105, poster: "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg", description: "Aspiring musician Miguel enters the Land of the Dead to find his great-great-grandfather." },
  { id: 27, title: "Top Gun: Maverick", genre: "Action", year: 2022, rating: 8.3, director: "Joseph Kosinski", duration: 130, poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg", description: "Maverick leads TOP GUN's elite graduates on a specialized mission." },
  { id: 28, title: "La La Land", genre: "Drama", year: 2016, rating: 8.0, director: "Damien Chazelle", duration: 128, poster: "https://image.tmdb.org/t/p/w1280/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", description: "A pianist and an actress fall in love while attempting to reconcile their aspirations." },
  { id: 29, title: "Blade Runner 2049", genre: "Sci-Fi", year: 2017, rating: 8.0, director: "Denis Villeneuve", duration: 164, poster: "https://image.tmdb.org/t/p/w1280/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", description: "A new blade runner's discovery leads him to track down Rick Deckard." },
  { id: 30, title: "Knives Out", genre: "Comedy", year: 2019, rating: 7.9, director: "Rian Johnson", duration: 130, poster: "https://image.tmdb.org/t/p/w1280/pThyQovXQrw2m0s9x82twj48Jq4.jpg", description: "A detective investigates the death of a patriarch of an eccentric family." },
  { id: 31, title: "Up", genre: "Animation", year: 2009, rating: 8.3, director: "Pete Docter", duration: 96, poster: "https://image.tmdb.org/t/p/w1280/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg", description: "An old man travels to Paradise Falls in his house equipped with balloons." },
  { id: 32, title: "Mad Max: Fury Road", genre: "Action", year: 2015, rating: 8.1, director: "George Miller", duration: 120, poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg", description: "In a wasteland, a woman rebels against a tyrannical ruler in search of her homeland." },
  { id: 33, title: "The Grand Budapest Hotel", genre: "Comedy", year: 2014, rating: 8.1, director: "Wes Anderson", duration: 99, poster: "https://image.tmdb.org/t/p/w1280/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg", description: "The adventures of a legendary concierge at a famous European hotel." },
  { id: 34, title: "Everything Everywhere All at Once", genre: "Sci-Fi", year: 2022, rating: 7.8, director: "Daniel Kwan", duration: 139, poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg", description: "An immigrant is swept up into an insane adventure by exploring other universes." },
  { id: 35, title: "Jurassic Park", genre: "Sci-Fi", year: 1993, rating: 8.2, director: "Steven Spielberg", duration: 127, poster: "https://image.tmdb.org/t/p/w1280/d9mtMGQDLANKieb9PbD3yK7xxzo.jpg", description: "Cloned dinosaurs run loose in a theme park island." },
  { id: 36, title: "Avatar", genre: "Sci-Fi", year: 2009, rating: 7.9, director: "James Cameron", duration: 162, poster: "https://image.tmdb.org/t/p/w1280/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg", description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn." },
  { id: 37, title: "Alien", genre: "Sci-Fi", year: 1979, rating: 8.5, director: "Ridley Scott", duration: 117, poster: "https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg", description: "The crew of a commercial spacecraft encounters a deadly lifeform." },
  { id: 38, title: "Aliens", genre: "Sci-Fi", year: 1986, rating: 8.4, director: "James Cameron", duration: 137, poster: "https://image.tmdb.org/t/p/w1280/r1x5JGpyqZU8PYhbs4UcrO1Xb6x.jpg", description: "Decades after surviving the Nostromo incident, Ellen Ripley sent back to LV-426." },
  { id: 39, title: "2001: A Space Odyssey", genre: "Sci-Fi", year: 1968, rating: 8.3, director: "Stanley Kubrick", duration: 149, poster: "https://image.tmdb.org/t/p/w1280/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg", description: "After uncovering a mysterious artifact buried beneath the Lunar surface, a spacecraft sent to Jupiter." },
  { id: 40, title: "A Quiet Place", genre: "Thriller", year: 2018, rating: 7.5, director: "John Krasinski", duration: 90, poster: "https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg", description: "A family must navigate their lives in silence to avoid mysterious creatures that hunt by sound." },
  { id: 41, title: "1917", genre: "Action", year: 2019, rating: 8.2, director: "Sam Mendes", duration: 119, poster: "https://image.tmdb.org/t/p/w500/iZf0KyrE25z1sage4SYFLCCrMi9.jpg", description: "Two British soldiers during WWI are given an impossible mission to deliver a message." },
  { id: 42, title: "Amélie", genre: "Comedy", year: 2001, rating: 8.3, director: "Jean-Pierre Jeunet", duration: 122, poster: "https://image.tmdb.org/t/p/w1280/nSxDa3M9aMvGVLoItzWTepQ5h5d.jpg", description: "An innocent and naive girl in Paris with her own sense of justice decides to help those around her." },
  { id: 43, title: "Anatomy of a Fall", genre: "Drama", year: 2023, rating: 7.7, director: "Justine Triet", duration: 151, poster: "https://image.tmdb.org/t/p/w1280/1ho0d4LNZw3Y0voeKmSvPSgJOJ2.jpg", description: "A woman is suspected of her husband's murder, and their blind son faces a moral dilemma." },
  { id: 44, title: "Apocalypse Now", genre: "Drama", year: 1979, rating: 8.4, director: "Francis Ford Coppola", duration: 147, poster: "https://image.tmdb.org/t/p/w1280/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg", description: "A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Officer." },
  { id: 45, title: "Arrival", genre: "Sci-Fi", year: 2016, rating: 7.9, director: "Denis Villeneuve", duration: 116, poster: "https://image.tmdb.org/t/p/w1280/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg", description: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear." },
  { id: 46, title: "Avengers: Infinity War", genre: "Action", year: 2018, rating: 8.4, director: "Anthony Russo", duration: 149, poster: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", description: "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos." },
  { id: 47, title: "Avengers: Endgame", genre: "Action", year: 2019, rating: 8.4, director: "Anthony Russo", duration: 181, poster: "https://image.tmdb.org/t/p/w1280/bR8ISy1O9XQxqiy0fQFw2BX72RQ.jpg", description: "After the devastating events of Infinity War, the universe is in ruins with the help of remaining allies." },
  { id: 48, title: "Braveheart", genre: "Action", year: 1995, rating: 8.3, director: "Mel Gibson", duration: 178, poster: "https://image.tmdb.org/t/p/w1280/or1gBugydmjToAEq7OZY0owwFk.jpg", description: "Scottish warrior William Wallace leads his countrymen in a rebellion to free his homeland." },
  { id: 49, title: "Casablanca", genre: "Drama", year: 1942, rating: 8.5, director: "Michael Curtiz", duration: 102, poster: "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg", description: "A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover." },
  { id: 50, title: "Casino", genre: "Drama", year: 1995, rating: 8.2, director: "Martin Scorsese", duration: 178, poster: "https://image.tmdb.org/t/p/w1280/gziIkUSnYuj9ChCi8qOu2ZunpSC.jpg", description: "A tale of greed, deception, money, power, and murder between two best friends." },
  { id: 51, title: "City of God", genre: "Drama", year: 2003, rating: 8.6, director: "Fernando Meirelles", duration: 130, poster: "https://image.tmdb.org/t/p/w1280/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg", description: "In the slums of Rio, two kids' paths diverge; one becomes a photographer, the other a kingpin." },
  { id: 52, title: "Django Unchained", genre: "Drama", year: 2012, rating: 8.5, director: "Quentin Tarantino", duration: 165, poster: "https://image.tmdb.org/t/p/w1280/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg", description: "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife." },
  { id: 53, title: "Drive", genre: "Action", year: 2011, rating: 7.8, director: "Nicolas Winding Refn", duration: 100, poster: "https://image.tmdb.org/t/p/w1280/602vevIURmpDfzbnv5Ubi6wIkQm.jpg", description: "A mysterious Hollywood stuntman and mechanic moonlights as a getaway driver." },
  { id: 54, title: "Eternal Sunshine of the Spotless Mind", genre: "Drama", year: 2004, rating: 8.3, director: "Michel Gondry", duration: 108, poster: "https://image.tmdb.org/t/p/w1280/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg", description: "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased." },
  { id: 55, title: "Fargo", genre: "Thriller", year: 1996, rating: 8.1, director: "Joel Coen", duration: 98, poster: "https://image.tmdb.org/t/p/w1280/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg", description: "Minnesota car salesman Jerry Lundegaard's inept crime collapses due to persistent police work." },
  { id: 56, title: "Finding Nemo", genre: "Animation", year: 2003, rating: 8.2, director: "Andrew Stanton", duration: 100, poster: "https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg", description: "After his son is captured in the Great Barrier Reef, a timid clownfish embarks on a journey." },
  { id: 57, title: "Get Out", genre: "Thriller", year: 2017, rating: 7.8, director: "Jordan Peele", duration: 104, poster: "https://image.tmdb.org/t/p/w1280/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg", description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness." },
  { id: 58, title: "Good Will Hunting", genre: "Drama", year: 1997, rating: 8.3, director: "Gus Van Sant", duration: 126, poster: "https://image.tmdb.org/t/p/w1280/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg", description: "Will Hunting, a janitor at M.I.T., has a gift for mathematics, but needs help from a psychologist." },
  { id: 59, title: "Heat", genre: "Action", year: 1995, rating: 8.3, director: "Michael Mann", duration: 170, poster: "https://image.tmdb.org/t/p/w1280/umSVjVdbVwtx5ryCA2QXL44Durm.jpg", description: "A group of high-end professional thieves start to feel the heat from the LAPD when they leave a clue." },
  { id: 60, title: "Howl's Moving Castle", genre: "Animation", year: 2004, rating: 8.2, director: "Hayao Miyazaki", duration: 119, poster: "https://image.tmdb.org/t/p/w1280/13kOl2v0nD2OLbVSHnHk8GUFEhO.jpg", description: "When an unconfident young woman is cursed with an old body by a spiteful witch, her only chance lies with a wizard." },
  { id: 61, title: "Inglourious Basterds", genre: "Action", year: 2009, rating: 8.4, director: "Quentin Tarantino", duration: 153, poster: "https://image.tmdb.org/t/p/w1280/aupnPtagH9JVBuMrGEanf4iqXEQ.jpg", description: "In Nazi-occupied France during WWII, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides." },
  { id: 62, title: "Jaws", genre: "Thriller", year: 1975, rating: 8.1, director: "Steven Spielberg", duration: 124, poster: "https://image.tmdb.org/t/p/w1280/lxM6kqilAdpdhqUl2biYp5frUxE.jpg", description: "When a killer shark unleashes chaos on a beach community, a local sheriff, a marine biologist, and an old seaman hunt it." },
  { id: 63, title: "Joker", genre: "Drama", year: 2019, rating: 8.4, director: "Todd Phillips", duration: 122, poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", description: "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain." },
  { id: 64, title: "Kill Bill: Vol. 1", genre: "Action", year: 2003, rating: 8.2, director: "Quentin Tarantino", duration: 111, poster: "https://image.tmdb.org/t/p/w1280/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg", description: "After awakening from a four-year coma, a former assassin wreaks vengeance on the team of assassins who betrayed her." },
  { id: 65, title: "L.A. Confidential", genre: "Thriller", year: 1997, rating: 8.2, director: "Curtis Hanson", duration: 138, poster: "https://image.tmdb.org/t/p/w1280/lWCgf5sD5FpMljjpkRhcC8pXcch.jpg", description: "As corruption grows in 1950s Los Angeles, three policemen - one sinister, one optimistic, and one obsessed." },
  { id: 66, title: "Léon: The Professional", genre: "Action", year: 1994, rating: 8.5, director: "Luc Besson", duration: 110, poster: "https://image.tmdb.org/t/p/w1280/bxB2q91nKYp8JNzqE7t7TWBVupB.jpg", description: "12-year-old Mathilda is reluctantly taken in by Léon, a professional assassin, after her family is murdered." },
  { id: 67, title: "Memento", genre: "Thriller", year: 2000, rating: 8.4, director: "Christopher Nolan", duration: 113, poster: "https://image.tmdb.org/t/p/w1280/nzlv62aC0octS5AklAiWpXLX9Z0.jpg", description: "A man with short-term memory loss attempts to track down his wife's murderer." },
  { id: 68, title: "Monsters, Inc.", genre: "Animation", year: 2001, rating: 8.1, director: "Pete Docter", duration: 92, poster: "https://image.tmdb.org/t/p/w1280/wFSpyMsp7H0ttERbxY7Trlv8xry.jpg", description: "In order to power the city, monsters have to scare children so that they scream. However, the children are toxic." },
  { id: 69, title: "No Country for Old Men", genre: "Drama", year: 2007, rating: 8.2, director: "Ethan Coen", duration: 122, poster: "https://image.tmdb.org/t/p/w1280/6d5XOczc226jECq0LIX0siKtgHR.jpg", description: "Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars." },
  { id: 70, title: "Once Upon a Time in Hollywood", genre: "Comedy", year: 2019, rating: 7.6, director: "Quentin Tarantino", duration: 161, poster: "https://image.tmdb.org/t/p/w1280/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg", description: "A faded television actor and his stunt double strive to achieve fame and success in the final years of Hollywood's Golden Age." },
  { id: 71, title: "Pan's Labyrinth", genre: "Drama", year: 2006, rating: 8.2, director: "Guillermo del Toro", duration: 118, poster: "https://image.tmdb.org/t/p/w1280/7wb2Ldp0oAx1lcZvffq9RfWoI2h.jpg", description: "In the Falangist Spain of 1944, the bookish young stepdaughter of a sadistic army officer escapes into an eerie world." },
  { id: 72, title: "Psycho", genre: "Thriller", year: 1960, rating: 8.5, director: "Alfred Hitchcock", duration: 109, poster: "https://image.tmdb.org/t/p/w1280/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg", description: "A Phoenix secretary embezzles $40,000 from her employer's client, goes on the run and checks into a remote motel." },
  { id: 73, title: "Raging Bull", genre: "Drama", year: 1980, rating: 8.1, director: "Martin Scorsese", duration: 129, poster: "https://image.tmdb.org/t/p/w1280/1WV7WlTS8LI1L5NkCgjWT9GSW3O.jpg", description: "The life of boxer Jake LaMotta, whose violence and temper that led him to the top in the ring destroyed his life outside it." },
  { id: 74, title: "Ratatouille", genre: "Animation", year: 2007, rating: 8.1, director: "Brad Bird", duration: 111, poster: "https://image.tmdb.org/t/p/w1280/t3vaWRPSf6WjDSamIkKDs1iQWna.jpg", description: "A rat who can cook makes an unusual alliance with a young kitchen worker at a prominent restaurant." },
  { id: 75, title: "Reservoir Dogs", genre: "Thriller", year: 1992, rating: 8.3, director: "Quentin Tarantino", duration: 99, poster: "https://image.tmdb.org/t/p/w1280/xi8Iu6qyTfyZVDVy60raIOYJJmk.jpg", description: "When a simple jewelry heist goes horribly wrong, the surviving criminals begin to suspect that one of them is a police informant." },
  { id: 76, title: "Scarface", genre: "Drama", year: 1983, rating: 8.3, director: "Brian De Palma", duration: 170, poster: "https://image.tmdb.org/t/p/w1280/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg", description: "In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed." },
  { id: 77, title: "Schindler's List", genre: "Drama", year: 1993, rating: 9.0, director: "Steven Spielberg", duration: 195, poster: "https://image.tmdb.org/t/p/w1280/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", description: "In German-occupied Poland during WWII, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce." },
  { id: 78, title: "Shutter Island", genre: "Thriller", year: 2010, rating: 8.2, director: "Martin Scorsese", duration: 138, poster: "https://image.tmdb.org/t/p/w1280/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg", description: "In 1954, a U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane." },
  { id: 79, title: "Snatch", genre: "Comedy", year: 2000, rating: 8.2, director: "Guy Ritchie", duration: 102, poster: "https://image.tmdb.org/t/p/w1280/kJZoAHq1SLDdWjeNGtlHAnGpmFV.jpg", description: "Unscrupulous boxing promoters, violent bookmakers, a Russian gangster, incompetent thieves and supposedly Jewish jewelers fight to track down a stolen diamond." },
  { id: 80, title: "Soul", genre: "Animation", year: 2020, rating: 8.0, director: "Pete Docter", duration: 100, poster: "https://image.tmdb.org/t/p/w1280/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg", description: "After landing the gig of a lifetime, a New York jazz pianist suddenly finds himself trapped in a strange land between Earth and the afterlife." },
  { id: 81, title: "Taxi Driver", genre: "Drama", year: 1976, rating: 8.2, director: "Martin Scorsese", duration: 114, poster: "https://image.tmdb.org/t/p/w1280/ekstpH614fwDX8DUln1a2Opz0N8.jpg", description: "A mentally unstable veteran works as a nighttime taxi driver in New York City, where the perceived decadence fuels his urge for violent action." },
  { id: 82, title: "The Departed", genre: "Drama", year: 2006, rating: 8.5, director: "Martin Scorsese", duration: 151, poster: "https://image.tmdb.org/t/p/w1280/nT97ifVT2J1yMQmeq20Qblg61T.jpg", description: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston." },
  { id: 83, title: "The Green Mile", genre: "Drama", year: 1999, rating: 8.6, director: "Frank Darabont", duration: 189, poster: "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg", description: "A tale set on death row in a Southern prison, where gentle giant John Coffey possesses a mysterious healing power." },
  { id: 84, title: "The Lives of Others", genre: "Drama", year: 2006, rating: 8.4, director: "Florian Henckel von Donnersmarck", duration: 137, poster: "https://image.tmdb.org/t/p/w1280/cVUDMnskSc01rdbyH0tLATTJUdP.jpg", description: "In 1984 East Berlin, an agent of the secret police conducting surveillance on a writer and his lover finds himself becoming increasingly absorbed by their lives." },
  { id: 85, title: "The Pianist", genre: "Drama", year: 2002, rating: 8.5, director: "Roman Polanski", duration: 150, poster: "https://image.tmdb.org/t/p/w1280/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg", description: "A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto in World War II." },
  { id: 86, title: "The Social Network", genre: "Drama", year: 2010, rating: 7.8, director: "David Fincher", duration: 120, poster: "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg", description: "As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by two brothers." },
  { id: 87, title: "The Truman Show", genre: "Comedy", year: 1998, rating: 8.2, director: "Peter Weir", duration: 103, poster: "https://image.tmdb.org/t/p/w1280/vuza0WqY239yBXOadKlGwJsZJFE.jpg", description: "An insurance salesman discovers his whole life is actually a reality TV show." },
  { id: 88, title: "The Usual Suspects", genre: "Thriller", year: 1995, rating: 8.5, director: "Bryan Singer", duration: 106, poster: "https://image.tmdb.org/t/p/w1280/99X2SgyFunJFXGAYnDv3sb9pnUD.jpg", description: "A sole survivor tells the twisting events leading up to a horrific gun battle on a boat, which began when five criminals met in a police lineup." },
  { id: 89, title: "The Wolf of Wall Street", genre: "Comedy", year: 2013, rating: 8.2, director: "Martin Scorsese", duration: 180, poster: "https://image.tmdb.org/t/p/w1280/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg", description: "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime." },
  { id: 90, title: "There Will Be Blood", genre: "Drama", year: 2007, rating: 8.2, director: "Paul Thomas Anderson", duration: 158, poster: "https://image.tmdb.org/t/p/w1280/fa0RDkAlCec0STeMNAhPaF89q6U.jpg", description: "A story of family, religion, hatred, oil and madness, focusing on a turn-of-the-century prospector in the early days of business." },
  { id: 91, title: "Toy Story", genre: "Animation", year: 1995, rating: 8.3, director: "John Lasseter", duration: 81, poster: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg", description: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room." },
  { id: 92, title: "V for Vendetta", genre: "Action", year: 2005, rating: 8.1, director: "James McTeigue", duration: 132, poster: "https://image.tmdb.org/t/p/w1280/1avD1JeaRiJX5M4ahPdZPypGoGN.jpg", description: "In a future British tyrannical regime, a freedom fighter, known only as V, uses terrorist tactics to fight oppression." },
  { id: 93, title: "Vertigo", genre: "Thriller", year: 1958, rating: 8.3, director: "Alfred Hitchcock", duration: 128, poster: "https://image.tmdb.org/t/p/w1280/15uOEfqBNTVtDUT7hGBVCka0rZz.jpg", description: "A former San Francisco police detective juggling wrestling with personal demons becomes obsessed with a hauntingly beautiful woman." },
  { id: 94, title: "Warrior", genre: "Action", year: 2011, rating: 8.2, director: "Gavin O'Connor", duration: 140, poster: "https://image.tmdb.org/t/p/w1280/iM8n4nZJPR2abpnyZ36FUgHiRjr.jpg", description: "The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament." },
  { id: 95, title: "Your Name", genre: "Animation", year: 2016, rating: 8.4, director: "Makoto Shinkai", duration: 106, poster: "https://image.tmdb.org/t/p/w1280/vfJFJPepRKapMd5G2ro7klIRysq.jpg", description: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?" },
  { id: 96, title: "Zodiac", genre: "Thriller", year: 2007, rating: 7.7, director: "David Fincher", duration: 157, poster: "https://image.tmdb.org/t/p/w1280/6YmeO4pB7XTh8P8F960O1uA14JO.jpg", description: "Between 1968 and 1983, a San Francisco cartoonist becomes an amateur detective obsessed with tracking down the Zodiac Killer." },
  { id: 97, title: "Her", genre: "Sci-Fi", year: 2013, rating: 8.0, director: "Spike Jonze", duration: 126, poster: "https://image.tmdb.org/t/p/w1280/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg", description: "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need." },
  { id: 98, title: "Ex Machina", genre: "Sci-Fi", year: 2014, rating: 7.7, director: "Alex Garland", duration: 108, poster: "https://image.tmdb.org/t/p/w1280/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg", description: "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I." },
  { id: 99, title: "Drive My Car", genre: "Drama", year: 2021, rating: 7.6, director: "Ryusuke Hamaguchi", duration: 179, poster: "https://image.tmdb.org/t/p/w1280/znXps7wPyYq8UDCfeyO2vfEIeRS.jpg", description: "A renowned stage actor and director receives an offer to direct a production of Uncle Vanya at a theater festival in Hiroshima." },
  { id: 100, title: "The Zone of Interest", genre: "Drama", year: 2023, rating: 7.5, director: "Jonathan Glazer", duration: 105, poster: "https://image.tmdb.org/t/p/w1280/hUu9zyZmDd8VZegKi1iK1Vk0RYS.jpg", description: "Auschwitz commandant Rudolf Höss and his wife Hedwig strive to build a dream life for their family in a house and garden next to the camp." }
];

const initializeMovies = () => {
  const existingMovies = localStorage.getItem('cineverse_movies');
  if (!existingMovies) {
    localStorage.setItem('cineverse_movies', JSON.stringify(MOVIES_DATA));
    return MOVIES_DATA;
  }
  return JSON.parse(existingMovies);
};

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getMovies: async ({ search = '', genre = '', sortBy = 'title', page = 1, limit = 10 } = {}) => {
    await delay();
    let movies = initializeMovies();

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      movies = movies.filter(m => 
        m.title.toLowerCase().includes(query) || 
        (m.director && m.director.toLowerCase().includes(query))
      );
    }

    if (genre) {
      movies = movies.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
    }

    movies.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'yearDesc') return b.year - a.year;
      if (sortBy === 'ratingDesc') return b.rating - a.rating;
      return 0;
    });

    const totalCount = movies.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedMovies = movies.slice(startIndex, startIndex + limit);

    return {
      data: paginatedMovies,
      totalCount,
      totalPages,
      currentPage: page
    };
  },

  addMovie: async (newMovieData) => {
    await delay();
    const movies = initializeMovies();

    const newMovie = {
      id: Date.now(),
      title: newMovieData.title,
      genre: newMovieData.genre || 'Action',
      year: Number(newMovieData.year) || 2024,
      rating: Number(newMovieData.rating) || 7.0,
      director: newMovieData.director || 'Unknown Director',
      duration: Number(newMovieData.duration) || 120,
      description: newMovieData.description || 'No description provided.',
      poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsL_pt20.jpg' 
    };

    const updatedMovies = [newMovie, ...movies];
    localStorage.setItem('cineverse_movies', JSON.stringify(updatedMovies));
    return newMovie;
  },

  deleteMovie: async (id) => {
    await delay();
    try {
      console.log("Удаляем фильм с id:", id, typeof id);
      
      
      const movies = initializeMovies();
      
      
      const updatedMovies = movies.filter(movie => String(movie.id) !== String(id));
      
      
      localStorage.setItem('cineverse_movies', JSON.stringify(updatedMovies));
      
      console.log("Успешно удалено. Осталось фильмов:", updatedMovies.length);
      return { success: true };
    } catch (error) {
      console.error('Ошибка при удалении фильма:', error);
      throw error;
    }
  }
};

export default api;