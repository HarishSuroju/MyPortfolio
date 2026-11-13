import React from 'react';
import useSectionDraft from '../useSectionDraft';
import { ensureIds, newId } from '../helpers';
import { Card, EditorShell, ImageInput, ListEditor, TagInput, TextArea, TextInput, Toggle } from '../ui';

const ANCHORS = [
    ['#hero', 'Top of page'],
    ['#about', 'About'],
    ['#skills', 'Skills'],
    ['#projects', 'Projects'],
    ['#internships', 'Internships'],
    ['#certificates', 'Certificates'],
    ['#leetcode', 'LeetCode'],
    ['#contact', 'Contact'],
];

export const SiteEditor = () => {
    const d = useSectionDraft('site', {
        normalize: (s) => ({ ...s, navLinks: ensureIds(s.navLinks) }),
    });
    const { draft, setDraft } = d;
    const set = (patch) => setDraft({ ...draft, ...patch });

    return (
        <EditorShell
            title="Site & Navigation"
            description="The brand name, menu links and footer shown on every page."
            draft={d}
        >
            <Card title="Branding">
                <TextInput label="Brand name" value={draft.brandName} onChange={(v) => set({ brandName: v })} hint="Shown at the top-left of the header." />
                <TextInput label="Footer text" value={draft.footerText} onChange={(v) => set({ footerText: v })} hint="The copyright year is added automatically." />
            </Card>

            <Card title="Menu links">
                <ListEditor
                    items={draft.navLinks}
                    onChange={(navLinks) => set({ navLinks })}
                    newItem={() => ({ id: newId(), label: 'New link', target: '#about', visible: true })}
                    itemTitle={(l) => l.label}
                    itemSubtitle={(l) => `${l.target}${l.visible ? '' : '  ·  hidden'}`}
                    addLabel="Add menu link"
                >
                    {(link, patch) => (
                        <>
                            <TextInput label="Label" value={link.label} onChange={(v) => patch({ label: v })} />
                            <TextInput
                                label="Goes to"
                                value={link.target}
                                onChange={(v) => patch({ target: v })}
                                list="anchor-options"
                                hint="Pick a section or type any URL."
                            />
                            <Toggle label="Show in menu" checked={link.visible} onChange={(v) => patch({ visible: v })} />
                        </>
                    )}
                </ListEditor>
                <datalist id="anchor-options">
                    {ANCHORS.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </datalist>
            </Card>
        </EditorShell>
    );
};

export const HeroEditor = () => {
    const d = useSectionDraft('hero');
    const { draft, setDraft } = d;
    const set = (patch) => setDraft({ ...draft, ...patch });

    return (
        <EditorShell title="Hero" description="The first thing visitors see." draft={d}>
            <Card title="Text">
                <TextInput label="Your name" value={draft.name} onChange={(v) => set({ name: v })} hint='Displayed as "Hi, I&apos;m ..."' />
                <TextArea label="Tagline" value={draft.title} onChange={(v) => set({ title: v })} rows={3} />
                <TextInput label="Button label" value={draft.ctaLabel} onChange={(v) => set({ ctaLabel: v })} placeholder="Get In Touch" />
            </Card>
            <Card title="Images">
                <ImageInput label="Profile photo" value={draft.profileImage} onChange={(v) => set({ profileImage: v })} folder="hero" />
                <ImageInput label="Background image" value={draft.backgroundImage} onChange={(v) => set({ backgroundImage: v })} folder="hero" />
            </Card>
        </EditorShell>
    );
};

export const AboutEditor = () => {
    const d = useSectionDraft('about');
    const { draft, setDraft } = d;
    const set = (patch) => setDraft({ ...draft, ...patch });

    return (
        <EditorShell title="About" description="Your story, experience level and highlighted skills." draft={d}>
            <Card title="Content">
                <TextInput label="Section title" value={draft.title} onChange={(v) => set({ title: v })} />
                <TextArea label="Description" value={draft.description} onChange={(v) => set({ description: v })} rows={9} hint="Blank lines start a new paragraph." />
                <TextInput label="Experience line" value={draft.experience} onChange={(v) => set({ experience: v })} />
                <TagInput label="Highlighted skills" value={draft.skills} onChange={(skills) => set({ skills })} />
            </Card>
            <Card title="Photo">
                <ImageInput label="About photo" value={draft.profileImage} onChange={(v) => set({ profileImage: v })} folder="about" />
            </Card>
        </EditorShell>
    );
};

export const ContactEditor = () => {
    const d = useSectionDraft('contact', {
        normalize: (c) => ({ ...c, socialLinks: { ...(c.socialLinks || {}) } }),
    });
    const { draft, setDraft } = d;
    const set = (patch) => setDraft({ ...draft, ...patch });
    const setSocial = (patch) => set({ socialLinks: { ...draft.socialLinks, ...patch } });

    return (
        <EditorShell title="Contact & Social" description="Used by the Contact button and the footer links." draft={d}>
            <Card title="Contact details">
                <TextInput label="Email" type="email" value={draft.email} onChange={(v) => set({ email: v })} hint='The "Say Hello" button opens a message to this address.' />
                <TextInput label="Phone" value={draft.phone} onChange={(v) => set({ phone: v })} />
                <TextInput label="Location" value={draft.location} onChange={(v) => set({ location: v })} />
            </Card>
            <Card title="Social links" >
                <TextInput label="GitHub" type="url" value={draft.socialLinks.github} onChange={(v) => setSocial({ github: v })} placeholder="https://github.com/you" />
                <TextInput label="LinkedIn" type="url" value={draft.socialLinks.linkedin} onChange={(v) => setSocial({ linkedin: v })} placeholder="https://linkedin.com/in/you" />
                <TextInput label="Twitter / X" type="url" value={draft.socialLinks.twitter} onChange={(v) => setSocial({ twitter: v })} placeholder="https://x.com/you" />
                <p className="text-xs text-slate-500">Leave a field empty to hide that link.</p>
            </Card>
        </EditorShell>
    );
};

export const LeetCodeEditor = () => {
    const d = useSectionDraft('leetcode');
    const { draft, setDraft } = d;

    return (
        <EditorShell title="LeetCode" description="Stats are fetched live from your public LeetCode profile." draft={d}>
            <Card>
                <TextInput
                    label="LeetCode username"
                    value={draft.username}
                    onChange={(v) => setDraft({ ...draft, username: v.trim() })}
                    hint="Leave empty to hide the whole LeetCode section."
                />
            </Card>
        </EditorShell>
    );
};
