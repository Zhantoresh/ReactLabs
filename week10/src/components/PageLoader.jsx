export default function PageLoader({ text = "Loading page…" }) {
  return <p className="state state--loading">{text}</p>;
}