import * as React from "react";
import ModalCatchAllFix from "./modal-catchAll-fix";

export default async function ModalLaoyut({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModalCatchAllFix>{children}</ModalCatchAllFix>;
}
