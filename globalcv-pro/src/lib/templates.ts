export function generateCVHtml(cvData: any): string {
  const p = cvData.personalInfo || {};
  const s = cvData.summary || {};
  const education = cvData.education || [];
  const experience = cvData.experience || [];
  const internships = cvData.internships || [];
  const projects = cvData.projects || [];
  const skills = cvData.skills || {};
  const certs = cvData.certifications || [];
  const langs = cvData.languages || [];
  const refs = cvData.references || [];
  const templateId = cvData.templateId || "modern";

  const techSkills = [
    ...(skills.technical?.languages || []),
    ...(skills.technical?.frameworks || []),
    ...(skills.technical?.databases || []),
    ...(skills.technical?.cloud || []),
    ...(skills.technical?.tools || []),
    ...(skills.technical?.design || []),
  ].filter(Boolean);
  const softSkills = skills.soft || [];

  const colors: Record<string, string> = {
    modern: "#1e40af", ats: "#1a1a1a", minimalist: "#374151",
    corporate: "#1e3a5f", tech: "#0f172a", creative: "#7c3aed", international: "#0369a1",
  };
  const accent = colors[templateId] || colors.modern;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.name || "Professional CV"}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Arial', sans-serif; font-size: 11px; line-height: 1.5; color: #1e293b; background: white; }
  .cv-wrapper { max-width: 210mm; margin: 0 auto; min-height: 297mm; }
  
  /* Header */
  .header { background: ${accent}; color: white; padding: 28px 32px; display: flex; align-items: center; gap: 20px; }
  .photo { width: 80px; height: 80px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.4); object-fit: cover; flex-shrink: 0; }
  .photo-placeholder { width: 80px; height: 80px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; flex-shrink: 0; }
  .header-info h1 { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
  .header-info h2 { font-size: 13px; font-weight: 500; opacity: 0.85; margin-top: 3px; }
  .contact-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
  .contact-item { font-size: 9.5px; opacity: 0.9; display: flex; align-items: center; gap: 4px; }
  
  /* Body */
  .body { display: grid; grid-template-columns: 2fr 1fr; gap: 0; }
  .main-col { padding: 24px 28px; }
  .side-col { padding: 24px 20px; background: #f8fafc; border-left: 1px solid #e2e8f0; }
  
  /* Sections */
  .section { margin-bottom: 22px; }
  .section-title { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.2px; color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 4px; margin-bottom: 12px; }
  .summary-text { font-size: 10.5px; line-height: 1.7; color: #475569; }
  
  /* Experience */
  .exp-item { margin-bottom: 14px; }
  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .exp-title { font-weight: 800; font-size: 11px; color: #1e293b; }
  .exp-company { font-size: 10px; color: ${accent}; font-weight: 600; }
  .exp-date { font-size: 9.5px; color: #94a3b8; white-space: nowrap; }
  .exp-desc { font-size: 10px; color: #64748b; margin-top: 4px; line-height: 1.6; }
  .exp-bullets { margin-top: 4px; padding-left: 12px; }
  .exp-bullets li { font-size: 10px; color: #475569; margin-bottom: 2px; }
  
  /* Skills */
  .skill-tag { display: inline-block; background: ${accent}18; color: ${accent}; border: 1px solid ${accent}30; padding: 2px 8px; border-radius: 4px; font-size: 9.5px; font-weight: 600; margin: 2px; }
  .skill-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-size: 10px; }
  
  /* Side sections */
  .side-section-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: ${accent}; border-bottom: 1px solid ${accent}40; padding-bottom: 3px; margin-bottom: 8px; }
  .side-item { margin-bottom: 8px; }
  .side-item-title { font-weight: 700; font-size: 10px; color: #1e293b; }
  .side-item-sub { font-size: 9.5px; color: #64748b; }
  
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="cv-wrapper">
  <!-- Header -->
  <div class="header">
    ${p.photo ? `<img src="${p.photo}" class="photo" alt="Profile" />` : `<div class="photo-placeholder">${(p.name || "?").charAt(0)}</div>`}
    <div class="header-info">
      <h1>${p.name || "Your Name"}</h1>
      <h2>${p.title || p.targetRole || s.targetRole || "Professional Title"}</h2>
      <div class="contact-row">
        ${p.email ? `<span class="contact-item">✉ ${p.email}</span>` : ""}
        ${p.phone ? `<span class="contact-item">📞 ${p.phone}</span>` : ""}
        ${p.city || p.country ? `<span class="contact-item">📍 ${[p.city, p.country].filter(Boolean).join(", ")}</span>` : ""}
        ${p.linkedin ? `<span class="contact-item">in ${p.linkedin}</span>` : ""}
        ${p.github ? `<span class="contact-item">⌥ ${p.github}</span>` : ""}
        ${p.portfolio ? `<span class="contact-item">🔗 ${p.portfolio}</span>` : ""}
      </div>
    </div>
  </div>

  <div class="body">
    <!-- Main column -->
    <div class="main-col">
      ${(s.summary || s.objective) ? `
      <div class="section">
        <div class="section-title">Professional Summary</div>
        ${s.objective ? `<p class="summary-text" style="margin-bottom:6px"><strong>Objective:</strong> ${s.objective}</p>` : ""}
        ${s.summary ? `<p class="summary-text">${s.summary}</p>` : ""}
      </div>` : ""}

      ${experience.length ? `
      <div class="section">
        <div class="section-title">Work Experience</div>
        ${experience.map((e: any) => `
          <div class="exp-item">
            <div class="exp-header">
              <div>
                <div class="exp-title">${e.position || e.role || ""}</div>
                <div class="exp-company">${e.company || ""} ${e.location ? `· ${e.location}` : ""}</div>
              </div>
              <div class="exp-date">${e.startDate || ""} ${e.endDate ? `– ${e.currentlyWorking ? "Present" : e.endDate}` : ""}</div>
            </div>
            ${e.responsibilities ? `<p class="exp-desc">${e.responsibilities}</p>` : ""}
            ${e.achievements ? `<p class="exp-desc"><strong>Achievements:</strong> ${e.achievements}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      ${internships.length ? `
      <div class="section">
        <div class="section-title">Internship Experience</div>
        ${internships.map((i: any) => `
          <div class="exp-item">
            <div class="exp-header">
              <div>
                <div class="exp-title">${i.role || ""}</div>
                <div class="exp-company">${i.organization || ""}</div>
              </div>
              <div class="exp-date">${i.duration || ""}</div>
            </div>
            ${i.description ? `<p class="exp-desc">${i.description}</p>` : ""}
            ${i.skillsLearned ? `<p class="exp-desc"><strong>Skills:</strong> ${i.skillsLearned}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      ${projects.length ? `
      <div class="section">
        <div class="section-title">Projects</div>
        ${projects.map((pr: any) => `
          <div class="exp-item">
            <div class="exp-header">
              <div class="exp-title">${pr.name || ""} ${pr.technologies ? `<span style="font-weight:500;color:#64748b;font-size:9.5px">· ${pr.technologies}</span>` : ""}</div>
              <div class="exp-date">${pr.githubLink ? `<a href="${pr.githubLink}" style="color:${accent}">GitHub</a>` : ""}${pr.liveLink ? ` · <a href="${pr.liveLink}" style="color:${accent}">Live</a>` : ""}</div>
            </div>
            ${pr.description ? `<p class="exp-desc">${pr.description}</p>` : ""}
            ${pr.results ? `<p class="exp-desc"><strong>Results:</strong> ${pr.results}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}
    </div>

    <!-- Side column -->
    <div class="side-col">
      ${education.length ? `
      <div class="section">
        <div class="side-section-title">Education</div>
        ${education.map((e: any) => `
          <div class="side-item">
            <div class="side-item-title">${e.degree || ""}</div>
            <div class="side-item-sub">${e.university || e.college || ""}</div>
            <div class="side-item-sub">${e.fieldOfStudy || ""}</div>
            <div class="side-item-sub">${e.graduationYear || ""} ${e.cgpa ? `· GPA: ${e.cgpa}` : ""}</div>
            ${e.honors ? `<div class="side-item-sub" style="color:${accent}">🏆 ${e.honors}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      ${techSkills.length ? `
      <div class="section">
        <div class="side-section-title">Technical Skills</div>
        <div>${techSkills.map((sk: string) => `<span class="skill-tag">${sk}</span>`).join("")}</div>
      </div>` : ""}

      ${softSkills.length ? `
      <div class="section">
        <div class="side-section-title">Soft Skills</div>
        <div>${softSkills.map((sk: string) => `<span class="skill-tag">${sk}</span>`).join("")}</div>
      </div>` : ""}

      ${certs.length ? `
      <div class="section">
        <div class="side-section-title">Certifications</div>
        ${certs.map((c: any) => `
          <div class="side-item">
            <div class="side-item-title">${c.name || ""}</div>
            <div class="side-item-sub">${c.issuer || ""} · ${c.issueDate || ""}</div>
          </div>
        `).join("")}
      </div>` : ""}

      ${langs.length ? `
      <div class="section">
        <div class="side-section-title">Languages</div>
        ${langs.map((l: any) => `
          <div class="skill-item">
            <span style="font-size:10px;font-weight:600;">${l.language || ""}</span>
            <span style="font-size:9.5px;color:#94a3b8;">${l.proficiency || ""}</span>
          </div>
        `).join("")}
      </div>` : ""}

      ${refs.length ? `
      <div class="section">
        <div class="side-section-title">References</div>
        ${refs.map((r: any) => `
          <div class="side-item">
            <div class="side-item-title">${r.name || ""}</div>
            <div class="side-item-sub">${r.position || ""} · ${r.company || ""}</div>
            <div class="side-item-sub">${r.email || ""}</div>
          </div>
        `).join("")}
      </div>` : ""}
    </div>
  </div>
</div>
</body>
</html>`;
}
