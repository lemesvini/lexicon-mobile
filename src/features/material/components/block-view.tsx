import { View } from "react-native";

import CalloutView from "@/features/material/components/blocks/callout";
import CanDoView from "@/features/material/components/blocks/can-do";
import DialogView from "@/features/material/components/blocks/dialog";
import EmailView from "@/features/material/components/blocks/email";
import EmbedView from "@/features/material/components/blocks/embed";
import ImageView from "@/features/material/components/blocks/image";
import ListView from "@/features/material/components/blocks/list";
import PostView from "@/features/material/components/blocks/post";
import TableView from "@/features/material/components/blocks/table";
import TextView from "@/features/material/components/blocks/text";
import TitleView from "@/features/material/components/blocks/title";
import UnsupportedView from "@/features/material/components/blocks/unsupported";
import type { ContainerBlock } from "@/features/material/types/container-block";
import type { MaterialBlock } from "@/features/material/types/material-block";

const GAP: Record<NonNullable<ContainerBlock["gap"]>, string> = {
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-7",
};

/** A container's blocks, always as a column on a phone — see ContainerBlock. */
function ContainerView({ block }: { block: ContainerBlock }) {
  return (
    <View
      className={`${GAP[block.gap ?? "md"]} ${block.align === "center" ? "items-center" : "items-stretch"}`}
    >
      {block.blocks.map((child, index) => (
        <BlockView key={index} block={child} />
      ))}
    </View>
  );
}

/** Any block of the material, drawn by its type. */
export default function BlockView({ block }: { block: MaterialBlock }) {
  switch (block.type) {
    case "container":
      return <ContainerView block={block} />;
    case "text":
      return <TextView block={block} />;
    case "list":
      return <ListView block={block} />;
    case "callout":
      return <CalloutView block={block} />;
    case "table":
      return <TableView block={block} />;
    case "dialog":
      return <DialogView block={block} />;
    case "title":
      return <TitleView block={block} />;
    case "can-do":
      return <CanDoView block={block} />;
    case "email":
      return <EmailView block={block} />;
    case "post":
      return <PostView block={block} />;
    case "image":
      return <ImageView block={block} />;
    case "embed":
      return <EmbedView block={block} />;
    default:
      return <UnsupportedView />;
  }
}
