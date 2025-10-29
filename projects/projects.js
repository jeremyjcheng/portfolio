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

// derive pie data: count of projects per year (label = year)
let rolledData = d3
  .rollups(
    projects,
    (v) => v.length,
    (d) => d.year
  )
  .sort((a, b) => d3.ascending(a[0], b[0]));

let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});

// generate pie slice data automatically (use the numeric `value` field)
let pieGenerator = d3.pie().value((d) => d.value);
let arcData = pieGenerator(data);

// pick colors
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// append each slice to the specific projects chart svg
d3.select("#projects-plot")
  .selectAll("path")
  .data(arcData)
  .join("path")
  .attr("d", arcGenerator)
  .attr("fill", (d, i) => colors(i));

let legend = d3.select(".legend");
data.forEach((d, idx) => {
  legend
    .append("li")
    .attr("class", "legend-item")
    .attr("style", `--color:${colors(idx)}`) // set the style attribute while passing in parameters
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
});
