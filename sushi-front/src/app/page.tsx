import Header from "@/components/general/Header";
import Nishida from "@/components/feature/Nishida";

export default function Home() {
  const NishidaProps = {
    animationRatio: 0.3,
  };
  return (
    <div>
      <Header />
      <Nishida {...NishidaProps} />
    </div>
  );
}
