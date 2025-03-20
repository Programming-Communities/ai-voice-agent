import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2>Subcribe To PC</h2>
      <Button variant="destructive" >subcriber</Button>
      <UserButton/>
    </div>
  );
}
