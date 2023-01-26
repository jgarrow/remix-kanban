import { ListItem } from "./routes/kanban";

export function getStarText(numStars: number) {
  return numStars > 1000 ? `${(numStars / 1000).toFixed(1)}k` : numStars;
}

type GenerateColumnsType = { [key in number]: ListItem[] };

// the keys (and values of listNum in ListItem) are for ease of moving items between columns
// and aren't dependent on what the names of the columns are
export function generateColumns(
  list: ListItem[],
  numCols: number
): GenerateColumnsType {
  const cols = Array.from({ length: numCols }, (_, i) => i + 1);
  const initialColumns = cols.reduce((acc, curr) => {
    acc[curr] = [] as ListItem[]

    return acc;
  }, {} as GenerateColumnsType)

  return list.reduce((acc, curr) => {
    acc[curr.listNum].push(curr);

    return acc;
  }, initialColumns);
}
