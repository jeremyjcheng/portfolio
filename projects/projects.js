import { fetchJSON, renderProjects } from "../global.js";

// Fetch project data from the JSON file
const projects = await fetchJSON("../lib/projects.json");

// Render the projects into the container
const projectsContainer = document.querySelector(".projects");

// Call the renderProjects function to display the projects
renderProjects(projects, projectsContainer, "h2");
