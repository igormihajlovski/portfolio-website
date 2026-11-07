const PROJECT_TYPES = Object.freeze([
  Object.freeze({ value: "Client Projects", key: "clientProjects" }),
  Object.freeze({ value: "Personal Portfolio", key: "personalPortfolio" }),
  Object.freeze({ value: "Demo Projects", key: "demoProjects" }),
  Object.freeze({ value: "Web Tools & Embeds", key: "webToolsEmbeds" }),
]);

function validateProjectType(value, sourceLabel = "<synthetic>") {
  if (!PROJECT_TYPES.some((type) => type.value === value)) {
    throw new Error(
      `[content] Project "${sourceLabel}" has invalid or missing project_type "${String(value ?? "<empty>")}". Expected one of: ${PROJECT_TYPES.map((type) => type.value).join(", ")}.`,
    );
  }

  return value;
}

// The localized collection already supplies published projects in date order.
function groupProjectsByType(projects = []) {
  const groups = PROJECT_TYPES.map((type) => ({ ...type, projects: [] }));
  const groupsByType = new Map(groups.map((group) => [group.value, group]));

  for (const project of projects) {
    const type = validateProjectType(
      project.data.project_type,
      project.inputPath || project.data.slug,
    );
    groupsByType.get(type).projects.push(project);
  }

  return groups.filter((group) => group.projects.length);
}

module.exports = { PROJECT_TYPES, validateProjectType, groupProjectsByType };
