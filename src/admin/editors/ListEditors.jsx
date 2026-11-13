import React from 'react';
import useSectionDraft from '../useSectionDraft';
import { ensureIds, newId } from '../helpers';
import { EditorShell, ImageInput, LinesInput, ListEditor, Range, TagInput, TextArea, TextInput, Toggle } from '../ui';

const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Mobile', 'DevOps', 'DSA', 'Other'];

const listNormalize = (list) => ensureIds(Array.isArray(list) ? list : []);

// useSectionDraft treats the stored value as one blob, so list sections wrap
// the array: draft is always the array itself here.
const useListDraft = (key) =>
    useSectionDraft(key, { fallback: [], normalize: listNormalize });

export const SkillsEditor = () => {
    const d = useListDraft('skills');
    const { draft, setDraft } = d;
    const categories = [...new Set([...SKILL_CATEGORIES, ...draft.map((s) => s.category).filter(Boolean)])];

    return (
        <EditorShell title="Skills" description="Grouped by category on the public site. Drag order = display order." draft={d}>
            <ListEditor
                items={draft}
                onChange={setDraft}
                newItem={() => ({ id: newId(), name: '', category: 'Frontend', level: 50 })}
                itemTitle={(s) => s.name}
                itemSubtitle={(s) => `${s.category} · ${s.level}%`}
                addLabel="Add skill"
                emptyText="No skills yet."
            >
                {(skill, patch) => (
                    <>
                        <TextInput label="Name" value={skill.name} onChange={(v) => patch({ name: v })} />
                        <TextInput label="Category" value={skill.category} onChange={(v) => patch({ category: v })} list="skill-categories" hint="Pick one or type a new category." />
                        <Range label="Proficiency" value={skill.level} onChange={(v) => patch({ level: v })} />
                    </>
                )}
            </ListEditor>
            <datalist id="skill-categories">
                {categories.map((c) => <option key={c} value={c} />)}
            </datalist>
        </EditorShell>
    );
};

export const ProjectsEditor = () => {
    const d = useListDraft('projects');
    const { draft, setDraft } = d;

    return (
        <EditorShell title="Projects" description="Add, edit, reorder or remove projects." draft={d}>
            <ListEditor
                items={draft}
                onChange={setDraft}
                newItem={() => ({ id: newId(), title: '', description: '', image: '', technologies: [], githubUrl: '', liveUrl: '', inProgress: false })}
                itemTitle={(p) => p.title}
                itemSubtitle={(p) => (p.technologies || []).join(' · ')}
                addLabel="Add project"
                emptyText="No projects yet."
            >
                {(project, patch) => (
                    <>
                        <TextInput label="Title" value={project.title} onChange={(v) => patch({ title: v })} />
                        <TextArea label="Description" value={project.description} onChange={(v) => patch({ description: v })} rows={4} />
                        <ImageInput label="Screenshot" value={project.image} onChange={(v) => patch({ image: v })} folder="projects" />
                        <TagInput label="Technologies" value={project.technologies} onChange={(v) => patch({ technologies: v })} />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextInput label="GitHub URL" type="url" value={project.githubUrl} onChange={(v) => patch({ githubUrl: v })} />
                            <TextInput label="Live demo URL" type="url" value={project.liveUrl} onChange={(v) => patch({ liveUrl: v })} />
                        </div>
                        <Toggle label="Mark as in progress" checked={project.inProgress} onChange={(v) => patch({ inProgress: v })} />
                    </>
                )}
            </ListEditor>
        </EditorShell>
    );
};

export const InternshipsEditor = () => {
    const d = useListDraft('internships');
    const { draft, setDraft } = d;

    return (
        <EditorShell title="Internships & Experience" description="Roles shown in the Internships section." draft={d}>
            <ListEditor
                items={draft}
                onChange={setDraft}
                newItem={() => ({ id: newId(), company: '', position: '', duration: '', location: '', description: '', skills: [], achievements: [] })}
                itemTitle={(i) => [i.position, i.company].filter(Boolean).join(' at ')}
                itemSubtitle={(i) => i.duration}
                addLabel="Add internship"
                emptyText="No internships yet."
            >
                {(item, patch) => (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextInput label="Company" value={item.company} onChange={(v) => patch({ company: v })} />
                            <TextInput label="Role" value={item.position} onChange={(v) => patch({ position: v })} />
                            <TextInput label="Duration" value={item.duration} onChange={(v) => patch({ duration: v })} placeholder="Jun 2025 - Aug 2025" />
                            <TextInput label="Location" value={item.location} onChange={(v) => patch({ location: v })} />
                        </div>
                        <TextArea label="Description" value={item.description} onChange={(v) => patch({ description: v })} rows={4} />
                        <TagInput label="Skills developed" value={item.skills} onChange={(v) => patch({ skills: v })} />
                        <LinesInput label="Key achievements" value={item.achievements} onChange={(v) => patch({ achievements: v })} rows={4} />
                    </>
                )}
            </ListEditor>
        </EditorShell>
    );
};

export const CertificatesEditor = () => {
    const d = useListDraft('certificates');
    const { draft, setDraft } = d;

    return (
        <EditorShell title="Certificates" description="Courses and credentials, with an image of each certificate." draft={d}>
            <ListEditor
                items={draft}
                onChange={setDraft}
                newItem={() => ({ id: newId(), title: '', issuer: '', date: '', image: '', description: '', credentialUrl: '' })}
                itemTitle={(c) => c.title}
                itemSubtitle={(c) => [c.issuer, c.date].filter(Boolean).join(' · ')}
                addLabel="Add certificate"
                emptyText="No certificates yet."
            >
                {(cert, patch) => (
                    <>
                        <TextInput label="Title" value={cert.title} onChange={(v) => patch({ title: v })} />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextInput label="Issuer" value={cert.issuer} onChange={(v) => patch({ issuer: v })} />
                            <TextInput label="Date" value={cert.date} onChange={(v) => patch({ date: v })} placeholder="2025" />
                        </div>
                        <TextArea label="Description" value={cert.description} onChange={(v) => patch({ description: v })} rows={3} />
                        <ImageInput label="Certificate image" value={cert.image} onChange={(v) => patch({ image: v })} folder="certificates" />
                        <TextInput label="Credential URL" type="url" value={cert.credentialUrl} onChange={(v) => patch({ credentialUrl: v })} hint="Optional. Adds a Verify link." />
                    </>
                )}
            </ListEditor>
        </EditorShell>
    );
};
