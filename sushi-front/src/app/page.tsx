import AddWord from "@/components/feature/AddWord";
import Nishida from "@/components/feature/Nishida";
import SushiListManager from "@/components/feature/SushiListManager";

export default function Home() {
  return (
    <div>
      <Nishida></Nishida>
      <AddWord></AddWord>
      <SushiListManager></SushiListManager>
    </div>
  );
}
  