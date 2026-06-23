"use client";
import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiPlus, FiTrash2, FiEye } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";

interface CVFormProps {
  cvData: any;
  onChange: (data: any) => void;
  activeSection: string;
  setActiveSection: (s: string) => void;
  onGeneratePreview: () => void;
  aiLoading: boolean;
}

function Section({ title, id, active, onToggle, children }: any) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-left">
        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{title}</span>
        {active === id ? <FiChevronUp className="text-slate-400" size={16} /> : <FiChevronDown className="text-slate-400" size={16} />}
      </button>
      {active === id && (
        <div className="px-4 pb-4 pt-2 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition placeholder-slate-300";
const textareaCls = `${inputCls} resize-none`;

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function CVForm({ cvData, onChange, activeSection, setActiveSection, onGeneratePreview, aiLoading }: CVFormProps) {
  const update = (path: string, value: any) => {
    const keys = path.split(".");
    const newData = { ...cvData };
    let obj: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      obj[keys[i]] = { ...obj[keys[i]] };
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    onChange(newData);
  };

  const addItem = (section: string, defaults: any) => {
    onChange({ ...cvData, [section]: [...(cvData[section] || []), { id: uid(), ...defaults }] });
  };

  const removeItem = (section: string, id: string) => {
    onChange({ ...cvData, [section]: cvData[section].filter((i: any) => i.id !== id) });
  };

  const updateItem = (section: string, id: string, field: string, value: any) => {
    onChange({
      ...cvData,
      [section]: cvData[section].map((i: any) => i.id === id ? { ...i, [field]: value } : i),
    });
  };

  const p = cvData.personalInfo || {};
  const s = cvData.summary || {};

  return (
    <div className="p-4 space-y-3 pb-10">
      {/* Generate Preview Button */}
      <button onClick={onGeneratePreview} disabled={aiLoading}
        className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-sm transition disabled:opacity-50 shadow-md shadow-blue-700/20">
        {aiLoading ? <span className="animate-spin">⟳</span> : <FiEye size={14} />}
        Generate Live Preview
      </button>

      {/* ── PERSONAL INFO ── */}
      <Section title="1. Personal Information" id="personal" active={activeSection} onToggle={setActiveSection}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full Name"><input className={inputCls} value={p.name || ""} onChange={e => update("personalInfo.name", e.target.value)} placeholder="Haileyesus Tadilo" /></Field>
          <Field label="Professional Title"><input className={inputCls} value={p.title || ""} onChange={e => update("personalInfo.title", e.target.value)} placeholder="Software Engineer" /></Field>
          <Field label="Phone"><input className={inputCls} value={p.phone || ""} onChange={e => update("personalInfo.phone", e.target.value)} placeholder="+251 9XX XXX XXX" /></Field>
          <Field label="Email"><input className={inputCls} type="email" value={p.email || ""} onChange={e => update("personalInfo.email", e.target.value)} placeholder="you@email.com" /></Field>
          <Field label="City"><input className={inputCls} value={p.city || ""} onChange={e => update("personalInfo.city", e.target.value)} placeholder="Addis Ababa" /></Field>
          <Field label="Country"><input className={inputCls} value={p.country || ""} onChange={e => update("personalInfo.country", e.target.value)} placeholder="Ethiopia" /></Field>
          <Field label="LinkedIn"><input className={inputCls} value={p.linkedin || ""} onChange={e => update("personalInfo.linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" /></Field>
          <Field label="GitHub"><input className={inputCls} value={p.github || ""} onChange={e => update("personalInfo.github", e.target.value)} placeholder="github.com/yourname" /></Field>
          <Field label="Portfolio Website"><input className={inputCls} value={p.portfolio || ""} onChange={e => update("personalInfo.portfolio", e.target.value)} placeholder="yourwebsite.com" /></Field>
          <Field label="Date of Birth (optional)"><input className={inputCls} value={p.dob || ""} onChange={e => update("personalInfo.dob", e.target.value)} placeholder="DD/MM/YYYY" /></Field>
          <Field label="Nationality (optional)"><input className={inputCls} value={p.nationality || ""} onChange={e => update("personalInfo.nationality", e.target.value)} placeholder="Ethiopian" /></Field>
          <Field label="Profile Photo URL"><input className={inputCls} value={p.photo || ""} onChange={e => update("personalInfo.photo", e.target.value)} placeholder="https://..." /></Field>
        </div>
      </Section>

      {/* ── PROFESSIONAL SUMMARY ── */}
      <Section title="2. Professional Summary" id="summary" active={activeSection} onToggle={setActiveSection}>
        <Field label="Career Objective"><textarea className={textareaCls} rows={2} value={s.objective || ""} onChange={e => update("summary.objective", e.target.value)} placeholder="Seeking a challenging role..." /></Field>
        <Field label="Professional Summary"><textarea className={textareaCls} rows={3} value={s.summary || ""} onChange={e => update("summary.summary", e.target.value)} placeholder="Results-driven professional with..." /></Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Years of Experience"><input className={inputCls} value={s.yearsOfExperience || ""} onChange={e => update("summary.yearsOfExperience", e.target.value)} placeholder="3 years" /></Field>
          <Field label="Target Job Role"><input className={inputCls} value={s.targetRole || ""} onChange={e => update("summary.targetRole", e.target.value)} placeholder="Senior Developer" /></Field>
        </div>
      </Section>

      {/* ── EDUCATION ── */}
      <Section title="3. Education" id="education" active={activeSection} onToggle={setActiveSection}>
        {(cvData.education || []).map((e: any) => (
          <div key={e.id} className="relative border border-slate-100 dark:border-slate-700 rounded-lg p-3 space-y-2 bg-slate-50 dark:bg-slate-700/30">
            <button onClick={() => removeItem("education", e.id)} className="absolute right-2 top-2 p-1 text-slate-300 hover:text-red-500 transition"><FiTrash2 size={13} /></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label="University/College"><input className={inputCls} value={e.university || ""} onChange={ev => updateItem("education", e.id, "university", ev.target.value)} placeholder="Addis Ababa University" /></Field>
              <Field label="Degree"><input className={inputCls} value={e.degree || ""} onChange={ev => updateItem("education", e.id, "degree", ev.target.value)} placeholder="B.Sc." /></Field>
              <Field label="Field of Study"><input className={inputCls} value={e.fieldOfStudy || ""} onChange={ev => updateItem("education", e.id, "fieldOfStudy", ev.target.value)} placeholder="Computer Science" /></Field>
              <Field label="Graduation Year"><input className={inputCls} value={e.graduationYear || ""} onChange={ev => updateItem("education", e.id, "graduationYear", ev.target.value)} placeholder="2023" /></Field>
              <Field label="CGPA/GPA"><input className={inputCls} value={e.cgpa || ""} onChange={ev => updateItem("education", e.id, "cgpa", ev.target.value)} placeholder="3.8/4.0" /></Field>
              <Field label="Honors & Awards"><input className={inputCls} value={e.honors || ""} onChange={ev => updateItem("education", e.id, "honors", ev.target.value)} placeholder="Dean's List" /></Field>
            </div>
            <Field label="Relevant Coursework"><input className={inputCls} value={e.coursework || ""} onChange={ev => updateItem("education", e.id, "coursework", ev.target.value)} placeholder="Algorithms, Data Structures, ML..." /></Field>
          </div>
        ))}
        <button onClick={() => addItem("education", { university: "", degree: "", fieldOfStudy: "", graduationYear: "", cgpa: "", honors: "", coursework: "" })}
          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-200 dark:border-slate-600 rounded-lg py-2.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:border-blue-300 transition">
          <FiPlus size={13} /> Add Education
        </button>
      </Section>

      {/* ── WORK EXPERIENCE ── */}
      <Section title="4. Work Experience" id="experience" active={activeSection} onToggle={setActiveSection}>
        {(cvData.experience || []).map((e: any) => (
          <div key={e.id} className="relative border border-slate-100 dark:border-slate-700 rounded-lg p-3 space-y-2 bg-slate-50 dark:bg-slate-700/30">
            <button onClick={() => removeItem("experience", e.id)} className="absolute right-2 top-2 p-1 text-slate-300 hover:text-red-500 transition"><FiTrash2 size={13} /></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label="Company Name"><input className={inputCls} value={e.company || ""} onChange={ev => updateItem("experience", e.id, "company", ev.target.value)} placeholder="Google" /></Field>
              <Field label="Position/Title"><input className={inputCls} value={e.position || ""} onChange={ev => updateItem("experience", e.id, "position", ev.target.value)} placeholder="Software Engineer" /></Field>
              <Field label="Location"><input className={inputCls} value={e.location || ""} onChange={ev => updateItem("experience", e.id, "location", ev.target.value)} placeholder="Addis Ababa, ET" /></Field>
              <Field label="Start Date"><input className={inputCls} value={e.startDate || ""} onChange={ev => updateItem("experience", e.id, "startDate", ev.target.value)} placeholder="Jan 2022" /></Field>
              <Field label="End Date"><input className={inputCls} value={e.endDate || ""} onChange={ev => updateItem("experience", e.id, "endDate", ev.target.value)} placeholder="Present" disabled={e.currentlyWorking} /></Field>
              <Field label="Currently Working Here">
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={e.currentlyWorking || false} onChange={ev => updateItem("experience", e.id, "currentlyWorking", ev.target.checked)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-xs text-slate-600 dark:text-slate-300">Yes, currently working</span>
                </label>
              </Field>
            </div>
            <Field label="Responsibilities"><textarea className={textareaCls} rows={2} value={e.responsibilities || ""} onChange={ev => updateItem("experience", e.id, "responsibilities", ev.target.value)} placeholder="Led development of..." /></Field>
            <Field label="Achievements"><textarea className={textareaCls} rows={2} value={e.achievements || ""} onChange={ev => updateItem("experience", e.id, "achievements", ev.target.value)} placeholder="Increased performance by 40%..." /></Field>
            <Field label="Quantified Results"><input className={inputCls} value={e.results || ""} onChange={ev => updateItem("experience", e.id, "results", ev.target.value)} placeholder="Saved $50K annually, 30% faster load time" /></Field>
          </div>
        ))}
        <button onClick={() => addItem("experience", { company: "", position: "", location: "", startDate: "", endDate: "", currentlyWorking: false, responsibilities: "", achievements: "", results: "" })}
          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-200 dark:border-slate-600 rounded-lg py-2.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:border-blue-300 transition">
          <FiPlus size={13} /> Add Experience
        </button>
      </Section>

      {/* ── INTERNSHIPS ── */}
      <Section title="5. Internship Experience" id="internships" active={activeSection} onToggle={setActiveSection}>
        {(cvData.internships || []).map((i: any) => (
          <div key={i.id} className="relative border border-slate-100 dark:border-slate-700 rounded-lg p-3 space-y-2 bg-slate-50 dark:bg-slate-700/30">
            <button onClick={() => removeItem("internships", i.id)} className="absolute right-2 top-2 p-1 text-slate-300 hover:text-red-500 transition"><FiTrash2 size={13} /></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label="Organization"><input className={inputCls} value={i.organization || ""} onChange={ev => updateItem("internships", i.id, "organization", ev.target.value)} placeholder="EthioTelecom" /></Field>
              <Field label="Role"><input className={inputCls} value={i.role || ""} onChange={ev => updateItem("internships", i.id, "role", ev.target.value)} placeholder="IT Intern" /></Field>
              <Field label="Duration"><input className={inputCls} value={i.duration || ""} onChange={ev => updateItem("internships", i.id, "duration", ev.target.value)} placeholder="Jun 2022 – Aug 2022" /></Field>
            </div>
            <Field label="Description"><textarea className={textareaCls} rows={2} value={i.description || ""} onChange={ev => updateItem("internships", i.id, "description", ev.target.value)} placeholder="Assisted in..." /></Field>
            <Field label="Skills Learned"><input className={inputCls} value={i.skillsLearned || ""} onChange={ev => updateItem("internships", i.id, "skillsLearned", ev.target.value)} placeholder="Python, SQL, Data Analysis" /></Field>
          </div>
        ))}
        <button onClick={() => addItem("internships", { organization: "", role: "", duration: "", description: "", skillsLearned: "" })}
          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-200 dark:border-slate-600 rounded-lg py-2.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:border-blue-300 transition">
          <FiPlus size={13} /> Add Internship
        </button>
      </Section>

      {/* ── PROJECTS ── */}
      <Section title="6. Projects" id="projects" active={activeSection} onToggle={setActiveSection}>
        {(cvData.projects || []).map((pr: any) => (
          <div key={pr.id} className="relative border border-slate-100 dark:border-slate-700 rounded-lg p-3 space-y-2 bg-slate-50 dark:bg-slate-700/30">
            <button onClick={() => removeItem("projects", pr.id)} className="absolute right-2 top-2 p-1 text-slate-300 hover:text-red-500 transition"><FiTrash2 size={13} /></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label="Project Name"><input className={inputCls} value={pr.name || ""} onChange={ev => updateItem("projects", pr.id, "name", ev.target.value)} placeholder="E-Commerce Platform" /></Field>
              <Field label="Technologies Used"><input className={inputCls} value={pr.technologies || ""} onChange={ev => updateItem("projects", pr.id, "technologies", ev.target.value)} placeholder="React, Node.js, MongoDB" /></Field>
              <Field label="GitHub Link"><input className={inputCls} value={pr.githubLink || ""} onChange={ev => updateItem("projects", pr.id, "githubLink", ev.target.value)} placeholder="github.com/..." /></Field>
              <Field label="Live Demo Link"><input className={inputCls} value={pr.liveLink || ""} onChange={ev => updateItem("projects", pr.id, "liveLink", ev.target.value)} placeholder="https://..." /></Field>
            </div>
            <Field label="Description"><textarea className={textareaCls} rows={2} value={pr.description || ""} onChange={ev => updateItem("projects", pr.id, "description", ev.target.value)} placeholder="Built a full-stack..." /></Field>
            <Field label="Problem Solved"><input className={inputCls} value={pr.problem || ""} onChange={ev => updateItem("projects", pr.id, "problem", ev.target.value)} placeholder="Reduced manual work by 60%" /></Field>
            <Field label="Results"><input className={inputCls} value={pr.results || ""} onChange={ev => updateItem("projects", pr.id, "results", ev.target.value)} placeholder="1000+ users in first month" /></Field>
          </div>
        ))}
        <button onClick={() => addItem("projects", { name: "", technologies: "", description: "", problem: "", results: "", githubLink: "", liveLink: "" })}
          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-200 dark:border-slate-600 rounded-lg py-2.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:border-blue-300 transition">
          <FiPlus size={13} /> Add Project
        </button>
      </Section>

      {/* ── SKILLS ── */}
      <Section title="7. Skills" id="skills" active={activeSection} onToggle={setActiveSection}>
        <p className="text-xs text-slate-400 mb-2">Enter comma-separated values for each category.</p>
        {[
          { label: "Programming Languages", path: "skills.technical.languages", ph: "Python, JavaScript, Java" },
          { label: "Frameworks", path: "skills.technical.frameworks", ph: "React, Django, Spring Boot" },
          { label: "Databases", path: "skills.technical.databases", ph: "PostgreSQL, MongoDB, Redis" },
          { label: "Cloud Platforms", path: "skills.technical.cloud", ph: "AWS, GCP, Azure" },
          { label: "Tools", path: "skills.technical.tools", ph: "Docker, Git, Jira" },
          { label: "Design Software", path: "skills.technical.design", ph: "Figma, Adobe XD" },
        ].map(sk => (
          <Field key={sk.path} label={sk.label}>
            <input className={inputCls}
              value={(sk.path.split(".").reduce((o: any, k) => o?.[k], cvData) || []).join(", ")}
              onChange={e => update(sk.path, e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
              placeholder={sk.ph} />
          </Field>
        ))}
        <Field label="Soft Skills">
          <input className={inputCls}
            value={(cvData.skills?.soft || []).join(", ")}
            onChange={e => update("skills.soft", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
            placeholder="Communication, Leadership, Teamwork, Problem Solving" />
        </Field>
      </Section>

      {/* ── CERTIFICATIONS ── */}
      <Section title="8. Certifications" id="certifications" active={activeSection} onToggle={setActiveSection}>
        {(cvData.certifications || []).map((c: any) => (
          <div key={c.id} className="relative border border-slate-100 dark:border-slate-700 rounded-lg p-3 space-y-2 bg-slate-50 dark:bg-slate-700/30">
            <button onClick={() => removeItem("certifications", c.id)} className="absolute right-2 top-2 p-1 text-slate-300 hover:text-red-500 transition"><FiTrash2 size={13} /></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label="Certificate Name"><input className={inputCls} value={c.name || ""} onChange={ev => updateItem("certifications", c.id, "name", ev.target.value)} placeholder="AWS Solutions Architect" /></Field>
              <Field label="Issuing Organization"><input className={inputCls} value={c.issuer || ""} onChange={ev => updateItem("certifications", c.id, "issuer", ev.target.value)} placeholder="Amazon Web Services" /></Field>
              <Field label="Issue Date"><input className={inputCls} value={c.issueDate || ""} onChange={ev => updateItem("certifications", c.id, "issueDate", ev.target.value)} placeholder="March 2024" /></Field>
              <Field label="Credential ID"><input className={inputCls} value={c.credentialId || ""} onChange={ev => updateItem("certifications", c.id, "credentialId", ev.target.value)} placeholder="AWS-1234567" /></Field>
            </div>
          </div>
        ))}
        <button onClick={() => addItem("certifications", { name: "", issuer: "", issueDate: "", credentialId: "" })}
          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-200 dark:border-slate-600 rounded-lg py-2.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:border-blue-300 transition">
          <FiPlus size={13} /> Add Certification
        </button>
      </Section>

      {/* ── LANGUAGES ── */}
      <Section title="9. Languages" id="languages" active={activeSection} onToggle={setActiveSection}>
        {(cvData.languages || []).map((l: any) => (
          <div key={l.id} className="flex items-center gap-2">
            <input className={inputCls} value={l.language || ""} onChange={ev => updateItem("languages", l.id, "language", ev.target.value)} placeholder="Amharic" />
            <select className={inputCls} value={l.proficiency || ""} onChange={ev => updateItem("languages", l.id, "proficiency", ev.target.value)}>
              <option value="">Level</option>
              {["Native", "Fluent", "Advanced", "Intermediate", "Basic"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <button onClick={() => removeItem("languages", l.id)} className="p-2 text-slate-300 hover:text-red-500 transition shrink-0"><FiTrash2 size={13} /></button>
          </div>
        ))}
        <button onClick={() => addItem("languages", { language: "", proficiency: "" })}
          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-200 dark:border-slate-600 rounded-lg py-2.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:border-blue-300 transition">
          <FiPlus size={13} /> Add Language
        </button>
      </Section>

      {/* ── REFERENCES ── */}
      <Section title="10. References" id="references" active={activeSection} onToggle={setActiveSection}>
        {(cvData.references || []).map((r: any) => (
          <div key={r.id} className="relative border border-slate-100 dark:border-slate-700 rounded-lg p-3 space-y-2 bg-slate-50 dark:bg-slate-700/30">
            <button onClick={() => removeItem("references", r.id)} className="absolute right-2 top-2 p-1 text-slate-300 hover:text-red-500 transition"><FiTrash2 size={13} /></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Field label="Full Name"><input className={inputCls} value={r.name || ""} onChange={ev => updateItem("references", r.id, "name", ev.target.value)} placeholder="Dr. Abebe Girma" /></Field>
              <Field label="Position"><input className={inputCls} value={r.position || ""} onChange={ev => updateItem("references", r.id, "position", ev.target.value)} placeholder="Professor" /></Field>
              <Field label="Company/University"><input className={inputCls} value={r.company || ""} onChange={ev => updateItem("references", r.id, "company", ev.target.value)} placeholder="AAU" /></Field>
              <Field label="Phone"><input className={inputCls} value={r.phone || ""} onChange={ev => updateItem("references", r.id, "phone", ev.target.value)} placeholder="+251 9XX XXX XXX" /></Field>
              <Field label="Email"><input className={inputCls} value={r.email || ""} onChange={ev => updateItem("references", r.id, "email", ev.target.value)} placeholder="ref@email.com" /></Field>
            </div>
          </div>
        ))}
        <button onClick={() => addItem("references", { name: "", position: "", company: "", phone: "", email: "" })}
          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-200 dark:border-slate-600 rounded-lg py-2.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:border-blue-300 transition">
          <FiPlus size={13} /> Add Reference
        </button>
      </Section>
    </div>
  );
}
