console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "resume/", title: "Resume" },
  { url: "meta/", title: "Meta" },
  { url: "https://github.com/jeremyjcheng", title: "GitHub" },
];

let nav = document.createElement("nav");
document.body.prepend(nav);

const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/portfolio/";

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith("http") ? BASE_PATH + url : url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );
  if (a.host !== location.host) {
    a.target = "_blank";
  }
  nav.append(a);
}

document.body.insertAdjacentHTML(
  "afterbegin",
  `
    <label class="color-scheme">
      Theme:
      <select id="color-scheme">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
);

const select = document.querySelector("#color-scheme");
const savedScheme = localStorage.colorScheme || "light dark";
document.documentElement.style.setProperty("color-scheme", savedScheme);
select.value = savedScheme;

select.addEventListener("input", (event) => {
  const scheme = event.target.value;
  document.documentElement.style.setProperty("color-scheme", scheme);
  localStorage.colorScheme = scheme; // Save user preference
});

const form = document.querySelector("form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  let url = form.action + "?";
  let params = [];

  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  url += params.join("&");
  location.href = url;
});

// Function to fetch and parse JSON data from a given URL
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);

    // Debugging logs
    console.log("Fetching JSON data from:", url);
    console.log("Response status:", response.status);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching or parsing JSON data:", error);
  }
}

export function renderProjects(
  projects,
  containerElement,
  headingLevel = "h3"
) {
  console.log("Rendering project:", projects);
  // Clear existing content
  containerElement.innerHTML = "";

  projects.forEach((project) => {
    // Add each project to the container
    const article = document.createElement("article");

    // Resolve image path based on current location
    let imagePath = project.image;
    if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
      // If we're in a subdirectory (like /projects/), we need to go up one level
      if (location.pathname.includes("/projects/")) {
        imagePath = "../" + imagePath;
      }
    }

    // Populate the article with project details
    article.innerHTML = `
    <${headingLevel}>${project.title}</${headingLevel}>
    <img src="${imagePath}" alt="${project.title}">
    <p> ${project.description || ""} </p>
    <p class="year">Year: ${project.year || ""}</p>
  `;
    // Append the article to the container
    containerElement.appendChild(article);
  });
}

// Function to fetch GitHub data for a given username
export async function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
