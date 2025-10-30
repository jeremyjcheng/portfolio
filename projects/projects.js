import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

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

// d3 setup
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let pieGenerator = d3.pie().value((d) => d.value);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Search
let query = "";

let searchInput = document.querySelector(".searchBar");

searchInput.addEventListener("change", (event) => {
  // update query value
  query = event.target.value;

  // Filter projects
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.year.toString().includes(query)
  );

  // Clear container before re-rendering
  projectsContainer.innerHTML = "";

  // Render updated projects and update pie/legend
  renderProjects(filteredProjects, projectsContainer, "h2");
  renderPieChart(filteredProjects);
});
// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // Re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { label: String(year), value: count };
  });

  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArc = d3.arc().innerRadius(0).outerRadius(50);

  let newSVG = d3.select("#projects-plot");
  newSVG.selectAll("*").remove();
  d3.select(".legend").selectAll("*").remove();

  // update paths and legends
  const paths = newSVG
    .selectAll("path")
    .data(newArcData)
    .join("path")
    .attr("d", newArc)
    .attr("fill", (d, i) => d3.schemeTableau10[i % 10])
    .attr("stroke", "white");

  let legend = d3.select(".legend");
  const legendItems = legend
    .selectAll("li")
    .data(newData)
    .join("li")
    .attr("class", "legend-item")
    .attr("style", (d, i) => `--color:${d3.schemeTableau10[i % 10]}`)
    .html(
      (d) => `<span class=\"swatch\"></span> ${d.label} <em>(${d.value})</em>`
    );

  // selection state and syncing
  let selectedIndex = -1;

  function applySelection() {
    paths.attr("class", (d) =>
      newArcData.indexOf(d) === selectedIndex ? "selected" : null
    );
    legendItems.attr("class", (d, i) =>
      i === selectedIndex ? "legend-item selected" : "legend-item"
    );

    // Filter visible project cards based on selected year (if any)
    if (selectedIndex === -1) {
      renderProjects(projectsGiven, projectsContainer, "h2");
      titleElement.textContent = `${projectsGiven.length} Total Projects`;
    } else {
      const selectedYear = newData[selectedIndex].label;
      const filtered = projectsGiven.filter(
        (p) => String(p.year) === String(selectedYear)
      );
      renderProjects(filtered, projectsContainer, "h2");
      titleElement.textContent = `${filtered.length} Total Projects`;
    }
  }

  paths.on("click", (event, d) => {
    const i = newArcData.indexOf(d);
    selectedIndex = selectedIndex === i ? -1 : i;
    applySelection();
  });

  legendItems.on("click", function (event, d, i) {
    const idx = typeof i === "number" ? i : newData.indexOf(d);
    selectedIndex = selectedIndex === idx ? -1 : idx;
    applySelection();
  });

  applySelection();
}

// Call this function on page load
renderPieChart(projects);
