import { fetchJSON, renderProjects, fetchGithubData } from "./global.js";

// Fetching data from json file
const projects = await fetchJSON("./lib/projects.json");
// Getting the first 3 projects
const latestProjects = projects.slice(0, 3);

// Rendering projects to the container
const projectsContainer = document.querySelector(".projects");
renderProjects(latestProjects, projectsContainer, "h3");

// Getting GitHub data
const githubData = await fetchGithubData("jeremyjcheng");
// Rendering GitHub profile stats
// Render GitHub stats
const profileStats = document.querySelector("#profile-stats");

if (profileStats) {
  profileStats.innerHTML = `
    <div class="github-stats">
      <div class="stat">
        <h3>Followers</h3>
        <p>${githubData.followers}</p>
      </div>
      <div class="stat">
        <h3>Following</h3>
        <p>${githubData.following}</p>
      </div>
      <div class="stat">
        <h3>Public Repos</h3>
        <p>${githubData.public_repos}</p>
      </div>
      <div class="stat">
        <h3>Public Gists</h3>
        <p>${githubData.public_gists}</p>
      </div>
    </div>
  `;
}
