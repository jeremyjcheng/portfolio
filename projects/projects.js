import { fetchJSON, renderProjects } from "../global.js";

// Fetch project data from the JSON file
const projects = await fetchJSON("../lib/projects.json");

// Render the projects into the container
const projectsContainer = document.querySelector(".projects");

// Select the title element
const titleElement = document.querySelector(".projects-title");

// Displays the count of projects in the title
titleElement.textContent = `${projects.length} Total Projects`;

console.log("count of projects:", projects.length);

// Call the renderProjects function to display the projects
renderProjects(projects, projectsContainer, "h2");
