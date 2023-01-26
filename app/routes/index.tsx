import { ActionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Octokit } from "octokit";
import { Logo } from "~/components/Logo";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const repoUrl = formData.get("repo");

  invariant(repoUrl, "repoUrl is required");

  let url;
  try {
    url = new URL(repoUrl.toString());
  } catch (err) {
    return json({ errors: { repo: "Invalid URL" } }, { status: 400 });
  }

  // remove the empty string in the first index of the split
  // pull out the values for the repo name and owner
  const [owner, repo] = url.pathname.split("/").filter((str) => str.length);

  if (!owner || !repo) {
    return json({ errors: { repo: "Invalid URL" } }, { status: 400 });
  }

  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/branches",
      { owner, repo }
    );

    if (response.status !== 200) {
      throw new Error("GitHub request failed");
    }

    return redirect(`/kanban?owner=${owner}&repo=${repo}`);
  } catch (err) {
    return json({ errors: { repo: "Invalid URL" } }, { status: 404 });
  }
}

export default function Index() {
  const navigation = useNavigation();
  const data = useActionData<typeof action>();

  return (
    <main className="flex justify-between items-start flex-shrink-0 px-[150px] pt-[273px] text-shade-1 dark:text-dark-shade-1">
      <Logo />
      <div className="w-[754px]">
        <h1 className="text-5xl text-left font-semibold tracking-tighter max-w-[480px]">
          Start by pasting the repository URL.
        </h1>
        <Form method="post" className="w-full mt-[100px]">
          <div className="flex gap-[10px] w-full">
            <label htmlFor="repo" className="sr-only">
              GitHub repository url
            </label>
            <input
              name="repo"
              type="text"
              required
              autoComplete="off"
              placeholder="https://"
              className="w-full py-2 bg-transparent border-b-[1px] border-b-shade-1 dark:border-b-dark-shade-1 placeholder:text-shade-1/20 dark:placeholder:text-dark-shade-1/20"
            />
            <button
              type="submit"
              className="py-2 px-4 rounded-[4px] self-end dark:bg-dark-shade-4 dark:text-dark-shade-1 bg-shade-4 text-shade-1 tracking-[-0.0125em] leading-[1.4]"
            >
              {["submitting", "loading"].includes(navigation.state)
                ? "Loading..."
                : "Submit"}
            </button>
          </div>
          <div className="mt-[20px]">
            {data?.errors?.repo ? (
              <div className="text-red dark:text-dark-red">
                Oops! Something went wrong. Try again.
              </div>
            ) : null}
          </div>
        </Form>
      </div>
    </main>
  );
}
