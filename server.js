const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SKILLS_DB = [
  "python",
  "java",
  "sql",
  "react",
  "aws",
  "docker"
];

function extractSkills(text) {
  text = text.toLowerCase();

  return SKILLS_DB.filter(skill =>
    text.includes(skill)
  );
}

app.post("/analyze", (req, res) => {

  const resume_text = req.body?.resume_text || "";
  const job_description = req.body?.job_description || "";

  const resumeSkills = extractSkills(resume_text);
  const jdSkills = extractSkills(job_description);

  const matched = resumeSkills.filter(skill =>
    jdSkills.includes(skill)
  );

  const score = jdSkills.length
    ? Math.round((matched.length / jdSkills.length) * 100)
    : 0;

  const missing = jdSkills.filter(skill =>
    !resumeSkills.includes(skill)
  );

  res.json({
    match_score: score,
    resume_skills: resumeSkills,
    job_skills: jdSkills,
    missing_skills: missing
  });
});

app.listen(8000, () => {
  console.log("Server running on port 8000");
});