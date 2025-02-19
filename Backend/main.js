const fs = require("fs");

/**
 * Parses and replaces dynamic placeholders in an HTML template.
 *
 * @param {string} templatePath - The file path to the HTML template.
 * @param {object} placeholders - An object containing key-value pairs for placeholder replacements.
 * @returns {string} - The HTML string with placeholders replaced.
 */
const parseTemplate = (templatePath, placeholders) => {
  // Read the template file
  let template = fs.readFileSync(templatePath, "utf8");
  // Replace placeholders dynamically
  for (const [key, value] of Object.entries(placeholders)) {
    const placeholderPattern = new RegExp(`\\[${key}\\]`, "g"); // Match [key]
    template = template.replace(placeholderPattern, value);
  }

  return template;
};

module.exports = parseTemplate;
