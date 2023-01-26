import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ListItem, MoveItemArgs } from "~/routes/kanban";
import { Button, ButtonProps } from "../Button";

export type ItemProps = {
  item: ListItem;
  moveItem: MoveItemArgs;
  numColumns: number;
};

export default function Item({ item, moveItem, numColumns }: ItemProps) {
  const { name, listNum } = item;

  return (
    // this motion component `layoutId` is to
    // animate the item as it moves between columns
    <motion.li
      layoutId={name}
      className="h-[70px] w-full py-6 grid grid-cols-[48px_1fr_48px] items-center rounded-[4px] [&:not(:last-child)]:mb-[10px] text-shade-2 dark:text-dark-shade-2 bg-shade-4 dark:bg-dark-shade-4 hover:bg-shade-3 hover:dark:bg-dark-shade-3 transition-colors"
    >
      <ItemButton
        aria-label={`Move ${name} left`}
        disabled={listNum === 1}
        onClick={() => moveItem(item, "left")}
      >
        <ChevronLeft aria-hidden="true" focusable="false" />
      </ItemButton>
      <span className="col-start-2 text-center">{name}</span>
      <ItemButton
        aria-label={`Move ${name} right`}
        disabled={listNum === numColumns}
        onClick={() => moveItem(item, "right")}
      >
        <ChevronRight aria-hidden="true" focusable="false" />
      </ItemButton>
    </motion.li>
  );
}

function ItemButton({ disabled, children, ...rest }: ButtonProps) {
  return (
    <Button
      disabled={disabled}
      style={{
        opacity: disabled ? 0.1 : 1,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
