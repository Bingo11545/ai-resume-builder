// ─── Shared helpers ──────────────────────────────────────────────────────────

function contactRow(p: any, accent: string) {
  return [
    p.email    ? `<span>✉ ${p.email}</span>` : "",
    p.phone    ? `<span>📞 ${p.phone}</span>` : "",
    (p.city || p.country) ? `<span>📍 ${[p.city, p.country].filter(Boolean).join(", ")}</span>` : "",
    p.linkedin ? `<span>in ${p.linkedin}</span>` : "",
    p.github   ? `<span>⌥ ${p.github}</span>` : "",
    p.portfolio? `<span>🔗 ${p.portfolio}</span>` : "",
  ].filter(Boolean).join('<span style="opacity:.3;margin:0 4px">|</span>');
}

function expBlock(items: any[], accent: string) {
  return items.map(e => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-weight:800;font-size:11px">${e.position||e.role||""}</div>
          <div style="font-size:10px;color:${accent};font-weight:600">${e.company||e.organization||""} ${e.location?`· ${e.location}`:""}</div>
        </div>
        <div style="font-size:9.5px;color:#94a3b8;white-space:nowrap">${e.startDate||e.duration||""} ${e.endDate?`– ${e.currentlyWorking?"Present":e.endDate}`:""}</div>
      </div>
      ${e.responsibilities?`<p style="font-size:10px;color:#64748b;margin-top:3px;line-height:1.6">${e.responsibilities}</p>`:""}
      ${e.achievements?`<p style="font-size:10px;color:#64748b;margin-top:2px"><strong>Achievements:</strong> ${e.achievements}</p>`:""}
      ${e.description?`<p style="font-size:10px;color:#64748b;margin-top:3px">${e.description}</p>`:""}
      ${e.skillsLearned?`<p style="font-size:10px;color:#64748b"><strong>Skills:</strong> ${e.skillsLearned}</p>`:""}
    </div>`).join("");
}

function eduBlock(items: any[], accent: string) {
  return items.map(e => `
    <div style="margin-bottom:10px">
      <div style="font-weight:700;font-size:10.5px">${e.degree||""} ${e.fieldOfStudy?`in ${e.fieldOfStudy}`:""}</div>
      <div style="font-size:10px;color:${accent};font-weight:600">${e.university||e.college||""}</div>
      <div style="font-size:9.5px;color:#94a3b8">${e.graduationYear||""} ${e.cgpa?`· GPA: ${e.cgpa}`:""}</div>
      ${e.honors?`<div style="font-size:9.5px;color:${accent}">🏆 ${e.honors}</div>`:""}
    </div>`).join("");
}

function skillTags(arr: string[], accent: string) {
  return arr.map(s => `<span style="display:inline-block;background:${accent}18;color:${accent};border:1px solid ${accent}30;padding:2px 8px;border-radius:4px;font-size:9.5px;font-weight:600;margin:2px">${s}</span>`).join("");
}

function projectBlock(items: any[], accent: string) {
  return items.map(pr => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-weight:800;font-size:11px">${pr.name||""} ${pr.technologies?`<span style="font-weight:400;font-size:9.5px;color:#64748b">· ${pr.technologies}</span>`:""}</div>
        <div style="font-size:9.5px">${pr.githubLink?`<a href="${pr.githubLink}" style="color:${accent}">GitHub</a>`:""}${pr.liveLink?` · <a href="${pr.liveLink}" style="color:${accent}">Live</a>`:""}</div>
      </div>
      ${pr.description?`<p style="font-size:10px;color:#64748b;margin-top:3px">${pr.description}</p>`:""}
      ${pr.results?`<p style="font-size:10px;color:#64748b"><strong>Results:</strong> ${pr.results}</p>`:""}
    </div>`).join("");
}

function certBlock(items: any[]) {
  return items.map(c => `
    <div style="margin-bottom:8px">
      <div style="font-weight:700;font-size:10px">${c.name||""}</div>
      <div style="font-size:9.5px;color:#64748b">${c.issuer||""} · ${c.issueDate||""}</div>
    </div>`).join("");
}

function langBlock(items: any[]) {
  return items.map(l => `
    <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:10px">
      <span style="font-weight:600">${l.language||""}</span>
      <span style="color:#94a3b8">${l.proficiency||""}</span>
    </div>`).join("");
}

function refBlock(items: any[]) {
  return items.map(r => `
    <div style="margin-bottom:8px">
      <div style="font-weight:700;font-size:10px">${r.name||""}</div>
      <div style="font-size:9.5px;color:#64748b">${r.position||""} · ${r.company||""}</div>
      <div style="font-size:9.5px;color:#64748b">${r.email||""}</div>
    </div>`).join("");
}

function printStyles() {
  return `@page{margin:10mm;size:A4}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`;
}

// ─── Template 1: Modern Professional (split-column) ─────────────────────────

function templateModern(d: any, accent: string): string {
  const p = d.personalInfo||{}, s = d.summary||{};
  const tech = [...(d.skills?.technical?.languages||[]),(d.skills?.technical?.frameworks||[]),(d.skills?.technical?.databases||[]),(d.skills?.technical?.cloud||[]),(d.skills?.technical?.tools||[]),(d.skills?.technical?.design||[])].flat().filter(Boolean);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:11px;line-height:1.5;color:${d.textColor||"#1e293b"};background:white}
  .wrapper{max-width:210mm;margin:0 auto;min-height:297mm}
  .header{background:${accent};color:white;padding:28px 32px;display:flex;align-items:center;gap:20px}
  .photo{width:76px;height:76px;border-radius:50%;border:3px solid rgba(255,255,255,.4);object-fit:cover;flex-shrink:0}
  .avatar{width:76px;height:76px;border-radius:50%;border:3px solid rgba(255,255,255,.4);background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;flex-shrink:0}
  .h-name{font-size:22px;font-weight:900;letter-spacing:-.5px}.h-title{font-size:13px;opacity:.85;margin-top:3px}
  .contact{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;font-size:9.5px;opacity:.9}
  .body{display:grid;grid-template-columns:2fr 1fr}
  .main{padding:22px 26px}.side{padding:22px 18px;background:#f8fafc;border-left:1px solid #e2e8f0}
  .sec-title{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:${accent};border-bottom:2px solid ${accent};padding-bottom:4px;margin-bottom:12px}
  .side-title{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${accent};border-bottom:1px solid ${accent}40;padding-bottom:3px;margin-bottom:8px}
  .sec{margin-bottom:20px}${printStyles()}
  </style></head><body><div class="wrapper">
  <div class="header">
    ${p.photo?`<img src="${p.photo}" class="photo" alt="" />`:`<div class="avatar">${(p.name||"?").charAt(0)}</div>`}
    <div><div class="h-name">${p.name||"Your Name"}</div><div class="h-title">${p.title||s.targetRole||"Professional Title"}</div>
    <div class="contact">${contactRow(p, accent)}</div></div>
  </div>
  <div class="body">
    <div class="main">
      ${s.summary||s.objective?`<div class="sec"><div class="sec-title">Professional Summary</div>
        ${s.objective?`<p style="font-size:10.5px;color:#475569;margin-bottom:5px"><strong>Objective:</strong> ${s.objective}</p>`:""}
        ${s.summary?`<p style="font-size:10.5px;color:#475569;line-height:1.7">${s.summary}</p>`:""}</div>`:""}
      ${d.experience?.length?`<div class="sec"><div class="sec-title">Work Experience</div>${expBlock(d.experience,accent)}</div>`:""}
      ${d.internships?.length?`<div class="sec"><div class="sec-title">Internship Experience</div>${expBlock(d.internships,accent)}</div>`:""}
      ${d.projects?.length?`<div class="sec"><div class="sec-title">Projects</div>${projectBlock(d.projects,accent)}</div>`:""}
    </div>
    <div class="side">
      ${d.education?.length?`<div class="sec"><div class="side-title">Education</div>${eduBlock(d.education,accent)}</div>`:""}
      ${tech.length?`<div class="sec"><div class="side-title">Technical Skills</div><div>${skillTags(tech,accent)}</div></div>`:""}
      ${d.skills?.soft?.length?`<div class="sec"><div class="side-title">Soft Skills</div><div>${skillTags(d.skills.soft,accent)}</div></div>`:""}
      ${d.certifications?.length?`<div class="sec"><div class="side-title">Certifications</div>${certBlock(d.certifications)}</div>`:""}
      ${d.languages?.length?`<div class="sec"><div class="side-title">Languages</div>${langBlock(d.languages)}</div>`:""}
      ${d.references?.length?`<div class="sec"><div class="side-title">References</div>${refBlock(d.references)}</div>`:""}
    </div>
  </div>
</div></body></html>`;
}

// ─── Template 2: ATS Friendly (single column, plain) ───────────────────────

function templateAts(d: any, accent: string): string {
  const p = d.personalInfo||{}, s = d.summary||{};
  const tech = [...(d.skills?.technical?.languages||[]),(d.skills?.technical?.frameworks||[]),(d.skills?.technical?.databases||[]),(d.skills?.technical?.cloud||[]),(d.skills?.technical?.tools||[])].flat().filter(Boolean);
  const allSkills = [...tech, ...(d.skills?.soft||[])];
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Times New Roman',serif;font-size:11px;line-height:1.6;color:#000;background:white;padding:20px 32px}
  h1{font-size:20px;text-align:center;text-transform:uppercase;letter-spacing:2px}
  .subtitle{text-align:center;font-size:10.5px;color:#333;margin:4px 0 2px}
  .contact{text-align:center;font-size:9.5px;color:#555;margin-bottom:12px}
  .divider{border:none;border-top:2px solid #000;margin:8px 0}
  .thin{border:none;border-top:1px solid #ccc;margin:8px 0}
  .sec-title{font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;margin-top:14px}
  .row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px}
  .bold{font-weight:bold}.date{font-size:10px;color:#555;white-space:nowrap}
  p{font-size:10.5px;color:#333;margin-top:3px;line-height:1.6}${printStyles()}
  </style></head><body>
  <h1>${p.name||"Your Name"}</h1>
  <div class="subtitle">${p.title||s.targetRole||""}</div>
  <div class="contact">${[p.email,p.phone,(p.city&&p.country?`${p.city}, ${p.country}`:p.city||p.country),p.linkedin,p.github].filter(Boolean).join(" | ")}</div>
  <hr class="divider">
  ${s.summary?`<div class="sec-title">Professional Summary</div><p>${s.summary}</p><hr class="thin">`:""}
  ${d.experience?.length?`<div class="sec-title">Work Experience</div>${d.experience.map((e:any)=>`
    <div class="row"><div><span class="bold">${e.position||""}</span>, ${e.company||""} ${e.location?`— ${e.location}`:""}</div><div class="date">${e.startDate||""} ${e.endDate?`– ${e.currentlyWorking?"Present":e.endDate}`:""}</div></div>
    ${e.responsibilities?`<p>${e.responsibilities}</p>`:""}${e.achievements?`<p>• ${e.achievements}</p>`:""}`).join("<hr class='thin'>")}`:""} 
  ${d.education?.length?`<hr class="thin"><div class="sec-title">Education</div>${d.education.map((e:any)=>`
    <div class="row"><div><span class="bold">${e.degree||""}</span> ${e.fieldOfStudy?`in ${e.fieldOfStudy}`:""} — ${e.university||""}</div><div class="date">${e.graduationYear||""} ${e.cgpa?`GPA: ${e.cgpa}`:""}</div></div>`).join("")}`:""} 
  ${allSkills.length?`<hr class="thin"><div class="sec-title">Skills</div><p>${allSkills.join(" · ")}</p>`:""} 
  ${d.projects?.length?`<hr class="thin"><div class="sec-title">Projects</div>${d.projects.map((pr:any)=>`
    <div><span class="bold">${pr.name||""}</span> ${pr.technologies?`| ${pr.technologies}`:""}</div>
    ${pr.description?`<p>${pr.description}</p>`:""}`).join("<hr class='thin'>")}`:""} 
  ${d.certifications?.length?`<hr class="thin"><div class="sec-title">Certifications</div>${d.certifications.map((c:any)=>`<p>• ${c.name||""} — ${c.issuer||""} (${c.issueDate||""})</p>`).join("")}`:""} 
</body></html>`;
}

// ─── Template 3: Minimalist ─────────────────────────────────────────────────

function templateMinimalist(d: any, accent: string): string {
  const p = d.personalInfo||{}, s = d.summary||{};
  const tech = [...(d.skills?.technical?.languages||[]),(d.skills?.technical?.frameworks||[]),(d.skills?.technical?.databases||[]),(d.skills?.technical?.tools||[])].flat().filter(Boolean);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10.5px;line-height:1.7;color:#374151;background:white;padding:32px 40px}
  h1{font-size:28px;font-weight:300;letter-spacing:-1px;color:#111;margin-bottom:4px}
  .subtitle{font-size:13px;color:${accent};font-weight:500;margin-bottom:8px}
  .contact{font-size:9.5px;color:#9ca3af;margin-bottom:28px;display:flex;gap:12px;flex-wrap:wrap}
  .sec-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:#9ca3af;margin:20px 0 10px}
  .line{border:none;border-top:1px solid #e5e7eb;margin:6px 0 14px}
  .exp-row{display:flex;justify-content:space-between;margin-bottom:2px}
  .exp-co{font-size:10px;color:${accent};font-weight:500}
  .date{font-size:9.5px;color:#9ca3af}
  .tag{display:inline-block;border:1px solid ${accent}50;color:${accent};padding:1px 7px;border-radius:2px;font-size:9px;margin:2px}
  p{color:#6b7280;font-size:10px;margin-top:4px;line-height:1.7}${printStyles()}
  </style></head><body>
  <h1>${p.name||"Your Name"}</h1>
  <div class="subtitle">${p.title||s.targetRole||""}</div>
  <div class="contact">
    ${[p.email,p.phone,(p.city&&p.country?`${p.city}, ${p.country}`:p.city||p.country),p.linkedin].filter(Boolean).map(x=>`<span>${x}</span>`).join("")}
  </div>
  ${s.summary?`<div class="sec-title">About</div><hr class="line"><p style="font-size:10.5px;color:#4b5563;line-height:1.8">${s.summary}</p>`:""} 
  ${d.experience?.length?`<div class="sec-title">Experience</div><hr class="line">${d.experience.map((e:any)=>`
    <div style="margin-bottom:14px"><div class="exp-row"><span style="font-weight:600;font-size:11px">${e.position||""}</span><span class="date">${e.startDate||""} – ${e.currentlyWorking?"Present":e.endDate||""}</span></div>
    <div class="exp-co">${e.company||""} ${e.location?`· ${e.location}`:""}</div>
    ${e.responsibilities?`<p>${e.responsibilities}</p>`:""}</div>`).join("")}`:""} 
  ${d.education?.length?`<div class="sec-title">Education</div><hr class="line">${d.education.map((e:any)=>`
    <div style="margin-bottom:10px"><div class="exp-row"><span style="font-weight:600;font-size:10.5px">${e.degree||""} ${e.fieldOfStudy?`in ${e.fieldOfStudy}`:""}</span><span class="date">${e.graduationYear||""}</span></div>
    <div class="exp-co">${e.university||""}</div></div>`).join("")}`:""} 
  ${tech.length?`<div class="sec-title">Skills</div><hr class="line"><div>${tech.map(s=>`<span class="tag">${s}</span>`).join("")}</div>`:""} 
  ${d.projects?.length?`<div class="sec-title">Projects</div><hr class="line">${d.projects.map((pr:any)=>`
    <div style="margin-bottom:12px"><span style="font-weight:600">${pr.name||""}</span> ${pr.technologies?`<span style="color:#9ca3af;font-size:9.5px">· ${pr.technologies}</span>`:""}
    ${pr.description?`<p>${pr.description}</p>`:""}</div>`).join("")}`:""} 
</body></html>`;
}

// ─── Template 4: Corporate ──────────────────────────────────────────────────

function templateCorporate(d: any, accent: string): string {
  const p = d.personalInfo||{}, s = d.summary||{};
  const tech = [...(d.skills?.technical?.languages||[]),(d.skills?.technical?.frameworks||[]),(d.skills?.technical?.databases||[]),(d.skills?.technical?.tools||[])].flat().filter(Boolean);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;font-size:10.5px;line-height:1.6;color:${d.textColor||"#1e293b"};background:white}
  .header{border-top:6px solid ${accent};padding:24px 32px 18px;border-bottom:1px solid #e2e8f0}
  h1{font-size:24px;font-weight:bold;color:${accent};letter-spacing:.5px}
  .subtitle{font-size:12px;color:#64748b;font-style:italic;margin-top:3px}
  .contact{display:flex;gap:16px;margin-top:10px;font-size:9.5px;color:#64748b;flex-wrap:wrap}
  .body{display:grid;grid-template-columns:1fr 280px;gap:0}
  .main{padding:22px 28px;border-right:1px solid #e2e8f0}
  .side{padding:22px 20px;background:#fafbfc}
  .sec-title{font-size:12px;font-weight:bold;color:${accent};text-transform:uppercase;letter-spacing:1px;padding-bottom:5px;border-bottom:2px solid ${accent}20;margin-bottom:12px;margin-top:18px}
  .sec-title:first-child{margin-top:0}
  .side-title{font-size:10px;font-weight:bold;color:${accent};text-transform:uppercase;letter-spacing:.8px;padding-bottom:4px;border-bottom:1px solid ${accent}20;margin:16px 0 8px}
  .side-title:first-child{margin-top:0}
  .company{color:${accent};font-style:italic;font-size:10px}
  .tag{display:inline-block;background:white;border:1px solid ${accent}40;color:#374151;padding:2px 8px;border-radius:2px;font-size:9px;margin:2px;font-family:Arial,sans-serif}
  p{font-size:10px;color:#475569;margin-top:4px;line-height:1.7}${printStyles()}
  </style></head><body>
  <div class="header">
    <h1>${p.name||"Your Name"}</h1>
    <div class="subtitle">${p.title||s.targetRole||""}</div>
    <div class="contact">${[p.email,p.phone,(p.city&&p.country?`${p.city}, ${p.country}`:p.city||p.country),p.linkedin].filter(Boolean).join(" · ")}</div>
  </div>
  <div class="body">
    <div class="main">
      ${s.summary?`<div class="sec-title">Executive Summary</div><p style="font-size:10.5px">${s.summary}</p>`:""} 
      ${d.experience?.length?`<div class="sec-title">Professional Experience</div>${d.experience.map((e:any)=>`
        <div style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between"><span style="font-weight:bold;font-size:11px">${e.position||""}</span><span style="font-size:9.5px;color:#94a3b8">${e.startDate||""} – ${e.currentlyWorking?"Present":e.endDate||""}</span></div>
          <div class="company">${e.company||""} ${e.location?`| ${e.location}`:""}</div>
          ${e.responsibilities?`<p>${e.responsibilities}</p>`:""}
          ${e.achievements?`<p><strong>Key Achievement:</strong> ${e.achievements}</p>`:""}</div>`).join("")}`:""} 
      ${d.projects?.length?`<div class="sec-title">Key Projects</div>${projectBlock(d.projects,accent)}`:""} 
    </div>
    <div class="side">
      ${d.education?.length?`<div class="side-title">Education</div>${eduBlock(d.education,accent)}`:""} 
      ${tech.length?`<div class="side-title">Core Competencies</div><div>${tech.map(s=>`<span class="tag">${s}</span>`).join("")}</div>`:""} 
      ${d.skills?.soft?.length?`<div class="side-title">Leadership Skills</div><div>${d.skills.soft.map((s:string)=>`<span class="tag">${s}</span>`).join("")}</div>`:""} 
      ${d.certifications?.length?`<div class="side-title">Certifications</div>${certBlock(d.certifications)}`:""} 
      ${d.languages?.length?`<div class="side-title">Languages</div>${langBlock(d.languages)}`:""} 
    </div>
  </div>
</body></html>`;
}

// ─── Template 5: Tech Resume ────────────────────────────────────────────────

function templateTech(d: any, accent: string): string {
  const p = d.personalInfo||{}, s = d.summary||{};
  const allTech = {
    languages: d.skills?.technical?.languages||[],
    frameworks: d.skills?.technical?.frameworks||[],
    databases: d.skills?.technical?.databases||[],
    cloud: d.skills?.technical?.cloud||[],
    tools: d.skills?.technical?.tools||[],
  };
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Courier New',monospace;font-size:10.5px;line-height:1.6;color:#e2e8f0;background:#0f172a}
  .header{padding:28px 32px;border-bottom:1px solid #1e40af40;background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)}
  h1{font-size:24px;font-weight:bold;color:#60a5fa;letter-spacing:1px}
  .subtitle{color:#94a3b8;font-size:11px;margin-top:4px}
  .contact{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px;font-size:9.5px;color:#64748b}
  .body{display:grid;grid-template-columns:1fr 220px;background:#0f172a}
  .main{padding:22px 28px;border-right:1px solid #1e293b}
  .side{padding:22px 18px;background:#0a0f1e}
  .sec-title{font-size:10px;font-weight:bold;color:#60a5fa;text-transform:uppercase;letter-spacing:2px;margin:18px 0 10px;display:flex;align-items:center;gap:6px}
  .sec-title::before{content:">";color:${accent}}
  .side-title{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:2px;margin:14px 0 6px}
  .tag{display:inline-block;background:#1e293b;border:1px solid ${accent}50;color:${accent};padding:2px 7px;border-radius:3px;font-size:9px;margin:2px}
  p{font-size:10px;color:#94a3b8;margin-top:4px;line-height:1.7}
  .company{color:${accent};font-size:10px}
  .date{color:#475569;font-size:9.5px}${printStyles().replace("color:#000","color:#e2e8f0")}
  </style></head><body>
  <div class="header">
    <h1>${p.name||"dev.name"}</h1>
    <div class="subtitle">${p.title||s.targetRole||"Software Engineer"}</div>
    <div class="contact">${[p.email,p.phone,p.github,p.linkedin,p.portfolio].filter(Boolean).join(" · ")}</div>
  </div>
  <div class="body">
    <div class="main">
      ${s.summary?`<div class="sec-title">About</div><p>${s.summary}</p>`:""} 
      ${d.experience?.length?`<div class="sec-title">Experience</div>${d.experience.map((e:any)=>`
        <div style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between"><span style="font-weight:bold;color:#e2e8f0">${e.position||""}</span><span class="date">${e.startDate||""} – ${e.currentlyWorking?"now":e.endDate||""}</span></div>
          <div class="company">${e.company||""} ${e.location?`// ${e.location}`:""}</div>
          ${e.responsibilities?`<p>${e.responsibilities}</p>`:""}</div>`).join("")}`:""} 
      ${d.projects?.length?`<div class="sec-title">Projects</div>${d.projects.map((pr:any)=>`
        <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between"><span style="font-weight:bold;color:#e2e8f0">${pr.name||""}</span>${pr.githubLink?`<a href="${pr.githubLink}" style="color:${accent};font-size:9.5px">→ repo</a>`:""}</div>
        ${pr.technologies?`<div style="color:#64748b;font-size:9.5px">${pr.technologies}</div>`:""} 
        ${pr.description?`<p>${pr.description}</p>`:""}</div>`).join("")}`:""} 
    </div>
    <div class="side">
      ${Object.entries(allTech).filter(([,v])=>(v as string[]).length).map(([k,v])=>`
        <div class="side-title">${k.charAt(0).toUpperCase()+k.slice(1)}</div><div>${(v as string[]).map(s=>`<span class="tag">${s}</span>`).join("")}</div>`).join("")} 
      ${d.education?.length?`<div class="side-title">Education</div>${d.education.map((e:any)=>`
        <div style="margin-bottom:8px"><div style="font-weight:bold;font-size:10px;color:#e2e8f0">${e.degree||""}</div>
        <div style="font-size:9.5px;color:${accent}">${e.university||""}</div>
        <div style="font-size:9.5px;color:#475569">${e.graduationYear||""}</div></div>`).join("")}`:""} 
      ${d.certifications?.length?`<div class="side-title">Certifications</div>${d.certifications.map((c:any)=>`<p style="color:#94a3b8">• ${c.name||""}</p>`).join("")}`:""} 
      ${d.languages?.length?`<div class="side-title">Languages</div>${langBlock(d.languages)}`:""} 
    </div>
  </div>
</body></html>`;
}

// ─── Template 6: Creative Professional ─────────────────────────────────────

function templateCreative(d: any, accent: string): string {
  const p = d.personalInfo||{}, s = d.summary||{};
  const tech = [...(d.skills?.technical?.languages||[]),(d.skills?.technical?.frameworks||[]),(d.skills?.technical?.tools||[]),(d.skills?.technical?.design||[])].flat().filter(Boolean);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Trebuchet MS',sans-serif;font-size:10.5px;line-height:1.6;color:${d.textColor||"#1e293b"};background:white}
  .header{display:grid;grid-template-columns:auto 1fr;background:${accent};color:white;min-height:120px}
  .avatar-col{width:120px;display:flex;align-items:center;justify-content:center;background:${accent}dd;padding:20px}
  .photo{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.5)}
  .avatar{width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;border:3px solid rgba(255,255,255,.5)}
  .header-info{padding:24px 28px}
  h1{font-size:26px;font-weight:900;letter-spacing:-.5px}
  .subtitle{font-size:12px;opacity:.85;margin-top:3px}
  .contact{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;font-size:9.5px;opacity:.85}
  .body{display:grid;grid-template-columns:280px 1fr}
  .side{padding:24px 20px;background:#f1f5f9;border-right:3px solid ${accent}20}
  .main{padding:24px 26px}
  .sec-title{font-size:11px;font-weight:900;color:white;background:${accent};padding:4px 10px;border-radius:2px;margin:16px 0 10px;display:inline-block;text-transform:uppercase;letter-spacing:.8px}
  .sec-title:first-child{margin-top:0}
  .side-title{font-size:10px;font-weight:900;color:${accent};text-transform:uppercase;letter-spacing:1px;margin:14px 0 8px;display:flex;align-items:center;gap:5px}
  .side-title:first-child{margin-top:0}
  .side-title::before{content:"";display:block;width:14px;height:3px;background:${accent};border-radius:2px}
  .tag{display:inline-block;background:${accent}15;color:${accent};padding:3px 9px;border-radius:20px;font-size:9px;margin:2px;font-weight:600}
  p{font-size:10px;color:#475569;margin-top:4px;line-height:1.7}
  .company{color:${accent};font-size:10px;font-weight:600}${printStyles()}
  </style></head><body>
  <div class="header">
    <div class="avatar-col">${p.photo?`<img src="${p.photo}" class="photo" alt="" />`:`<div class="avatar">${(p.name||"?").charAt(0)}</div>`}</div>
    <div class="header-info">
      <h1>${p.name||"Your Name"}</h1>
      <div class="subtitle">${p.title||s.targetRole||""}</div>
      <div class="contact">${contactRow(p,accent)}</div>
    </div>
  </div>
  <div class="body">
    <div class="side">
      ${d.education?.length?`<div class="side-title">Education</div>${eduBlock(d.education,accent)}`:""} 
      ${tech.length?`<div class="side-title">Skills</div><div>${tech.map(s=>`<span class="tag">${s}</span>`).join("")}</div>`:""} 
      ${d.skills?.soft?.length?`<div class="side-title">Soft Skills</div><div>${d.skills.soft.map((s:string)=>`<span class="tag">${s}</span>`).join("")}</div>`:""} 
      ${d.certifications?.length?`<div class="side-title">Certifications</div>${certBlock(d.certifications)}`:""} 
      ${d.languages?.length?`<div class="side-title">Languages</div>${langBlock(d.languages)}`:""} 
    </div>
    <div class="main">
      ${s.summary?`<div class="sec-title">Profile</div><p style="font-size:10.5px">${s.summary}</p>`:""} 
      ${d.experience?.length?`<div class="sec-title">Experience</div>${d.experience.map((e:any)=>`
        <div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between"><span style="font-weight:800">${e.position||""}</span><span style="font-size:9.5px;color:#94a3b8">${e.startDate||""} – ${e.currentlyWorking?"Present":e.endDate||""}</span></div>
        <div class="company">${e.company||""} ${e.location?`· ${e.location}`:""}</div>
        ${e.responsibilities?`<p>${e.responsibilities}</p>`:""}</div>`).join("")}`:""} 
      ${d.projects?.length?`<div class="sec-title">Projects</div>${projectBlock(d.projects,accent)}`:""} 
      ${d.internships?.length?`<div class="sec-title">Internships</div>${expBlock(d.internships,accent)}`:""} 
    </div>
  </div>
</body></html>`;
}

// ─── Template 7: International CV ──────────────────────────────────────────

function templateInternational(d: any, accent: string): string {
  const p = d.personalInfo||{}, s = d.summary||{};
  const tech = [...(d.skills?.technical?.languages||[]),(d.skills?.technical?.frameworks||[]),(d.skills?.technical?.databases||[]),(d.skills?.technical?.cloud||[]),(d.skills?.technical?.tools||[])].flat().filter(Boolean);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Calibri',Arial,sans-serif;font-size:10.5px;line-height:1.65;color:#2d3748;background:white;padding:0}
  .header{background:white;padding:24px 36px 16px;border-bottom:3px solid ${accent}}
  h1{font-size:26px;font-weight:700;color:#1a202c;letter-spacing:-.5px}
  .subtitle{font-size:13px;color:${accent};font-weight:600;margin-top:3px}
  .contact-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:12px;font-size:9.5px;color:#4a5568}
  .contact-item{display:flex;align-items:center;gap:5px}
  .body{display:grid;grid-template-columns:1fr 240px;gap:0}
  .main{padding:20px 36px}
  .side{padding:20px 22px;background:#f7fafc;border-left:1px solid #e2e8f0}
  .sec-title{font-size:12px;font-weight:700;color:${accent};text-transform:uppercase;letter-spacing:1px;padding-bottom:5px;border-bottom:2px solid ${accent};margin:18px 0 12px}
  .sec-title:first-child{margin-top:0}
  .side-title{font-size:10px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:.8px;margin:14px 0 8px}
  .side-title:first-child{margin-top:0}
  .tag{display:inline-block;background:white;border:1px solid ${accent}40;color:#2d3748;padding:2px 8px;border-radius:3px;font-size:9px;margin:2px}
  .profile-photo{width:90px;height:110px;object-fit:cover;border:2px solid ${accent}30;float:right;margin:0 0 10px 16px}
  p{font-size:10px;color:#4a5568;margin-top:4px;line-height:1.7}${printStyles()}
  </style></head><body>
  <div class="header">
    <h1>${p.name||"Your Name"}</h1>
    <div class="subtitle">${p.title||s.targetRole||""}</div>
    <div class="contact-grid">
      ${p.email?`<div class="contact-item">✉ ${p.email}</div>`:""}
      ${p.phone?`<div class="contact-item">📞 ${p.phone}</div>`:""}
      ${(p.city||p.country)?`<div class="contact-item">📍 ${[p.city,p.country].filter(Boolean).join(", ")}</div>`:""}
      ${p.linkedin?`<div class="contact-item">in ${p.linkedin}</div>`:""}
      ${p.github?`<div class="contact-item">⌥ ${p.github}</div>`:""}
      ${p.nationality?`<div class="contact-item">🌍 ${p.nationality}</div>`:""}
      ${p.dob?`<div class="contact-item">🎂 ${p.dob}</div>`:""}
    </div>
  </div>
  <div class="body">
    <div class="main">
      ${p.photo?`<img src="${p.photo}" class="profile-photo" alt="Profile" />`:""} 
      ${s.summary?`<div class="sec-title">Personal Profile</div><p style="font-size:10.5px;line-height:1.8">${s.summary}</p>`:""} 
      ${d.experience?.length?`<div class="sec-title">Work Experience</div>${expBlock(d.experience,accent)}`:""} 
      ${d.internships?.length?`<div class="sec-title">Internship & Voluntary Experience</div>${expBlock(d.internships,accent)}`:""} 
      ${d.projects?.length?`<div class="sec-title">Notable Projects</div>${projectBlock(d.projects,accent)}`:""} 
    </div>
    <div class="side">
      ${d.education?.length?`<div class="side-title">Education</div>${eduBlock(d.education,accent)}`:""} 
      ${tech.length?`<div class="side-title">Technical Skills</div><div>${tech.map(s=>`<span class="tag">${s}</span>`).join("")}</div>`:""} 
      ${d.skills?.soft?.length?`<div class="side-title">Soft Skills</div><div>${d.skills.soft.map((s:string)=>`<span class="tag">${s}</span>`).join("")}</div>`:""} 
      ${d.languages?.length?`<div class="side-title">Languages</div>${langBlock(d.languages)}`:""} 
      ${d.certifications?.length?`<div class="side-title">Certifications</div>${certBlock(d.certifications)}`:""} 
      ${d.references?.length?`<div class="side-title">References</div>${refBlock(d.references)}`:""} 
    </div>
  </div>
</body></html>`;
}

// ─── Main export ────────────────────────────────────────────────────────────

export const COLOR_PRESETS = [
  { name: "Navy Blue",    hex: "#1e40af" },
  { name: "Royal Blue",  hex: "#1d4ed8" },
  { name: "Teal",        hex: "#0f766e" },
  { name: "Emerald",     hex: "#059669" },
  { name: "Indigo",      hex: "#4f46e5" },
  { name: "Violet",      hex: "#7c3aed" },
  { name: "Rose",        hex: "#e11d48" },
  { name: "Orange",      hex: "#ea580c" },
  { name: "Charcoal",    hex: "#334155" },
  { name: "Black",       hex: "#0f172a" },
];

export function generateCVHtml(cvData: any): string {
  const templateId = cvData.templateId || "modern";
  const accent = cvData.accentColor || "#1e40af";
  const textColor = cvData.textColor || "#1e293b";

  switch (templateId) {
    case "ats":           return templateAts({ ...cvData, textColor }, accent);
    case "minimalist":    return templateMinimalist({ ...cvData, textColor }, accent);
    case "corporate":     return templateCorporate({ ...cvData, textColor }, accent);
    case "tech":          return templateTech({ ...cvData, textColor }, accent);
    case "creative":      return templateCreative({ ...cvData, textColor }, accent);
    case "international": return templateInternational({ ...cvData, textColor }, accent);
    default:              return templateModern({ ...cvData, textColor }, accent);
  }
}
