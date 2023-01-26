import { useMemo, useState } from "react";
import { json, LoaderArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { generateColumns, getStarText } from "~/utils";
import {getRepoBranches, getRepoInfo} from "~/utils.server"
import {ArrowLeft, Star} from 'lucide-react';
import { Column } from "~/components/Column";

export type MoveDirection = "left" | "right";
export type MoveItemArgs = (item: ListItem, direction: MoveDirection) => void
export type ListItem = {
  name: string;
  listNum: number;
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  // if user comes to this page directly and the url forms an invalid repo
  // redirect back to the home page
  if (!owner || !repo) {
    return redirect("/");
  }

  // run requests concurrently
  const responses = await Promise.allSettled([getRepoBranches(owner, repo), getRepoInfo(owner, repo)])
  let branches;
  let repoInfo;

  for (const response of responses) {
    if (response.status === 'fulfilled' && response?.value) {
      // getRepoBranches returns an array, getRepoInfo does not
      if (Array.isArray(response.value.data)) {
        branches = response.value.data.map((res) => ({ name: res.name, listNum: 1 })) satisfies ListItem[];
      } else {
        repoInfo = response.value.data;
      }
    } else {
      return redirect("/");
    }
 }
  return json({ branches: branches ?? [], ...repoInfo });
}

const COLUMN_NAMES = ["In progress", "Review", "Ready to merge"];

export default function Kanban() {
  // get the initial state
  const { branches, name, description, stargazers_count: stars } = useLoaderData<typeof loader>();

  // manage columns as local state for item movement
  const [listItems, setListItems] = useState<ListItem[]>(branches);
  const columns = useMemo(() => {
    return Object.entries(generateColumns(listItems, COLUMN_NAMES.length));
  }, [listItems]);

  function moveItem(item: ListItem, direction: MoveDirection) {
    console.log('item: ', item)
    setListItems((prevListItems) => {
      // create a deep clone of listClones
      // over optimization here, but if listItems was a
      // more complex array of objects with nested objects and arrays,
      // we'd want to make sure to get all of those values
      const listClones = structuredClone(prevListItems);
      const itemToUpdateIndex = listClones.findIndex(
        ({ name }) => name === item.name
      );

      // if the item exists
      if (itemToUpdateIndex >= 0) {
        const itemToUpdate = listClones[itemToUpdateIndex];

        // if we're not already in the first column
        if (direction === "left" && itemToUpdate.listNum > 0) {
          itemToUpdate.listNum -= 1;

        // if we're not already in the last column
        } else if (direction === "right" && itemToUpdate.listNum < COLUMN_NAMES.length) {
          itemToUpdate.listNum += 1;
        }

        // move item to top of list
        listClones.splice(itemToUpdateIndex, 1);
        listClones.unshift(itemToUpdate);
      }

      return listClones;
    });
  }

  return (
    <main className="mx-[150px] my-[100px]">
      <div className="w-full mb-[100px] grid grid-cols-3 gap-5 items-start">
        <Link to='/'>
          <span className="sr-only">Home</span>
          <ArrowLeft />
        </Link>
        <div>
          {name ? <h1 className="text-5xl text-shade-1 dark:text-dark-shade-1 tracking-tighter font-semibold">{name}</h1> : null}
          {description ? <p className="mt-5 tracking-[-0.0125em] leading-[1.4]">{description}</p> : null}
        </div>
        <div className="justify-self-end flex items-center text-[0.875em]">
          {stars ?
            <>
              <Star className="mr-[10px] h-[14px] w-auto"/>
              {getStarText(stars)}
            </> 
            : null
          }
        </div>
      </div>
      <div className="w-full grid grid-cols-3 gap-5">
        {columns.map(([, items], i) => {
          return (
            <div key={i} >
              <div className="mb-5">
                {COLUMN_NAMES[i]} ({items.length})
              </div>
              <Column items={items} moveItem={moveItem} numColumns={COLUMN_NAMES.length}/>
            </div>
          );
        })}
      </div>
    </main>
  );
}
