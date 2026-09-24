const skills = [
  "Go",
  "Python",
  "C++",
  "Java",
  "JavaScript / TypeScript",
  "React",
  "Next.js",
  "PostgreSQL",
  "Docker",
  "Git",
];

export default function Skills() {
  return (
    <section className="section skills">
      <h2 className="section__title">Skills</h2>
      <ul className="skills__list">
        {skills.map((skill) => (
          <li key={skill} className="skills__pill">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}