import LazySection from "./LazySection";

export default function HomePage({ isHomePage = false }) {
  return (
    <main className="overflow-x-hidden fade-in">
      <LazySection isHomePage={isHomePage} />
    </main>
  );
}