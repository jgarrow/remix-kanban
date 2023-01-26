import { Octokit } from "octokit";
import { redirect } from "react-router";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function getRepoBranches(owner: string, repo: string) {
  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/branches",
      { owner, repo }
    );

    return response;
  } catch (err) {
    redirect("/");
  }
}

export async function getRepoInfo(owner: string, repo: string) {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}", {
      owner,
      repo,
    });

    return response;
  } catch (err) {
    redirect("/");
  }
}
