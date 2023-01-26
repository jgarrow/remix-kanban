import { motion } from "framer-motion";
import { ListItem } from "~/routes/kanban";
import Item, { ItemProps } from "./Item";

type ColumnProps = {
  items: ListItem[];
} & Pick<ItemProps, "moveItem" | "numColumns">;

export function Column({ items, moveItem, numColumns }: ColumnProps) {
  return (
    // this motion component `layout` is to animate the height when moving items around
    <motion.ul
      layout
      className="w-full list-none flex flex-col items-center h-fit min-h-[70px]"
    >
      {items.map((item) => (
        <Item
          key={item.name}
          item={item}
          moveItem={moveItem}
          numColumns={numColumns}
        />
      ))}
    </motion.ul>
  );
}
