import React, { useState, useEffect, useMemo } from 'react';
import { getPortfolioData, updatePortfolioSection } from '../utils/dataManager';
import { fetchLeetCodeProfile, fetchLeetCodeSolved, fetchLeetCodeContest, fetchLeetCodeSkills } from '../utils/leetcodeApi';
import { useAuth } from '../contexts/AuthContext';
import { Edit, Save, X, ExternalLink, Trophy, Target, Flame, Code } from 'lucide-react';
import toast from 'react-hot-toast';

const LeetCode = () => {
    const [username, setUsername] = useState('');
    const [editingUsername, setEditingUsername] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [profile, setProfile] = useState(null);
    const [solved, setSolved] = useState(null);
    const [contest, setContest] = useState(null);
    const [skills, setSkills] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const loadUsername = async () => {
            const data = await getPortfolioData();
            const saved = data.leetcode?.username || '';
            setUsername(saved);
        };
        loadUsername();
    }, []);

    useEffect(() => {
        if (!username) return;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [profileData, solvedData, contestData, skillsData] = await Promise.all([
                    fetchLeetCodeProfile(username),
                    fetchLeetCodeSolved(username).catch(() => null),
                    fetchLeetCodeContest(username).catch(() => null),
                    fetchLeetCodeSkills(username).catch(() => null),
                ]);
                setProfile(profileData);
                setSolved(solvedData);
                setContest(contestData);
                setSkills(skillsData);
            } catch {
                setError('Could not load LeetCode stats. The API may be warming up — try refreshing in a moment.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    const saveUsername = async () => {
        const trimmed = usernameInput.trim();
        if (!trimmed) return;
        setUsername(trimmed);
        setEditingUsername(false);
        await updatePortfolioSection('leetcode', { username: trimmed });
        toast.success('LeetCode username saved!');
    };

    // ---- calendar heatmap ----
    const calendarWeeks = useMemo(() => {
        if (!profile?.submissionCalendar) return [];
        let calendarData;
        try {
            calendarData = typeof profile.submissionCalendar === 'string'
                ? JSON.parse(profile.submissionCalendar)
                : profile.submissionCalendar;
        } catch { return []; }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const startDate = new Date(oneYearAgo);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const weeks = [];
        const current = new Date(startDate);
        while (current <= today) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const dayStart = new Date(current);
                dayStart.setHours(0, 0, 0, 0);
                const unix = Math.floor(dayStart.getTime() / 1000);
                week.push({
                    date: new Date(current),
                    count: calendarData[unix] || 0,
                    inRange: current >= oneYearAgo && current <= today,
                });
                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
        }
        return weeks;
    }, [profile]);

    const getHeatColor = (count) => {
        if (count === 0) return undefined;
        if (count <= 2) return 'rgba(52,211,153,0.3)';
        if (count <= 5) return 'rgba(52,211,153,0.55)';
        if (count <= 9) return 'rgba(52,211,153,0.75)';
        return 'rgba(52,211,153,1)';
    };

    const monthLabels = useMemo(() => {
        if (!calendarWeeks.length) return [];
        const labels = [];
        let lastMonth = -1;
        calendarWeeks.forEach((week, i) => {
            const month = week[0].date.getMonth();
            if (month !== lastMonth) {
                labels.push({ index: i, name: week[0].date.toLocaleString('default', { month: 'short' }) });
                lastMonth = month;
            }
        });
        return labels;
    }, [calendarWeeks]);

    const DifficultyBar = ({ label, solved, total, color }) => {
        const pct = total > 0 ? (solved / total) * 100 : 0;
        return (
            <div className="flex-1 space-card rounded-xl p-4">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="font-bold text-sm" style={{ color }}>{label}</span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{solved}/{total}</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}` }} />
                </div>
            </div>
        );
    };

    // ---- states ----
    if (!username && !isAuthenticated) return null;

    if (!username && isAuthenticated) {
        return (
            <section id="leetcode" className="section nebula-section py-20 px-6">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4 cosmic-text">LeetCode Profile</h2>
                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Set your LeetCode username to display your profile stats.</p>
                    <div className="inline-flex items-center space-x-2">
                        <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                            placeholder="Enter LeetCode username"
                            className="px-4 py-2 rounded-lg text-sm"
                            style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                            onKeyDown={(e) => e.key === 'Enter' && saveUsername()} />
                        <button onClick={saveUsername} className="px-4 py-2 rounded-lg text-sm"
                            style={{ background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)', color: 'var(--neon-blue)' }}>Save</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="leetcode" className="section nebula-section py-20 px-6">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 sm:mb-12">
                    <div className="text-center flex-1">
                        <h2 className="text-3xl sm:text-4xl font-bold cosmic-text mb-2">LeetCode Universe</h2>
                        <div className="flex items-center justify-center space-x-2" style={{ color: 'var(--text-secondary)' }}>
                            {editingUsername ? (
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                                        className="px-3 py-1 rounded text-sm" autoFocus
                                        style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--text-primary)' }}
                                        onKeyDown={(e) => { if (e.key === 'Enter') saveUsername(); if (e.key === 'Escape') setEditingUsername(false); }} />
                                    <button onClick={saveUsername} style={{ color: 'var(--neon-green)' }}><Save size={18} /></button>
                                    <button onClick={() => setEditingUsername(false)} style={{ color: '#f87171' }}><X size={18} /></button>
                                </div>
                            ) : (
                                <>
                                    <Code size={16} />
                                    <span className="font-medium">{username}</span>
                                    {isAuthenticated && (
                                        <button onClick={() => { setUsernameInput(username); setEditingUsername(true); }}
                                            style={{ color: 'var(--text-secondary)' }}><Edit size={14} /></button>
                                    )}
                                    <a href={`https://leetcode.com/u/${encodeURIComponent(username)}`} target="_blank" rel="noopener noreferrer"
                                       style={{ color: 'var(--neon-blue)', marginLeft: '8px' }}><ExternalLink size={14} /></a>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block w-10 h-10 border-4 rounded-full animate-spin"
                            style={{ borderColor: 'rgba(96,165,250,0.3)', borderTopColor: 'var(--neon-blue)' }} />
                        <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Scanning the coding galaxy...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center py-12 space-card rounded-xl p-8">
                        <p style={{ color: '#f87171' }}>{error}</p>
                    </div>
                )}

                {profile && !loading && (
                    <div className="space-y-8">
                        {/* Stats summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: <Target size={24} />, value: solved?.totalSolved ?? profile?.totalSolved ?? 0, label: 'Problems Solved', sub: `of ${solved?.totalQuestions ?? profile?.totalQuestions ?? '?'}`, color: 'var(--neon-cyan)' },
                                { icon: <Trophy size={24} />, value: (solved?.ranking || profile?.ranking) ? (solved?.ranking || profile?.ranking).toLocaleString() : 'N/A', label: 'Global Ranking', color: '#fbbf24' },
                                { icon: <Flame size={24} />, value: contest?.contestRating ? Math.round(contest.contestRating) : 'N/A', label: 'Contest Rating', sub: contest?.contestTopPercentage ? `Top ${contest.contestTopPercentage.toFixed(1)}%` : null, color: '#f97316' },
                                { icon: <Code size={24} />, value: contest?.contestAttend ?? 'N/A', label: 'Contests Attended', color: 'var(--neon-purple)' },
                            ].map((stat, i) => (
                                <div key={i} className="space-card rounded-xl p-6 text-center">
                                    <div style={{ color: stat.color }} className="flex justify-center mb-2">{stat.icon}</div>
                                    <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                                    {stat.sub && <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>{stat.sub}</div>}
                                </div>
                            ))}
                        </div>

                        {/* Difficulty breakdown */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <DifficultyBar label="Easy" solved={solved?.easySolved ?? profile?.easySolved ?? 0} total={solved?.totalEasy ?? profile?.totalEasy ?? 0} color="var(--neon-green)" />
                            <DifficultyBar label="Medium" solved={solved?.mediumSolved ?? profile?.mediumSolved ?? 0} total={solved?.totalMedium ?? profile?.totalMedium ?? 0} color="#fbbf24" />
                            <DifficultyBar label="Hard" solved={solved?.hardSolved ?? profile?.hardSolved ?? 0} total={solved?.totalHard ?? profile?.totalHard ?? 0} color="#f87171" />
                        </div>

                        {/* Skills */}
                        {skills?.data?.matchedUser?.tagProblemCounts && (
                            <div className="space-card rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4 cosmic-text">Skill Nebulae</h3>
                                {['advanced', 'intermediate', 'fundamental'].map((tier) => {
                                    const tags = skills.data.matchedUser.tagProblemCounts[tier];
                                    if (!tags || tags.length === 0) return null;
                                    const tierColors = {
                                        advanced: { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.35)', color: '#f87171' },
                                        intermediate: { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.35)', color: 'var(--neon-blue)' },
                                        fundamental: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)', color: 'var(--neon-green)' },
                                    };
                                    return (
                                        <div key={tier} className="mb-4">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2"
                                                style={{ background: tierColors[tier].bg, border: `1px solid ${tierColors[tier].border}`, color: tierColors[tier].color }}>
                                                {tier}
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag) => (
                                                    <span key={tag.tagSlug} className="px-2 py-0.5 rounded-full text-xs"
                                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                                                        {tag.tagName} <span style={{ opacity: 0.6 }}>×{tag.problemsSolved}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Submission calendar */}
                        {calendarWeeks.length > 0 && (
                            <div className="space-card rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4 cosmic-text">Submission Heatmap</h3>
                                <div className="overflow-x-auto">
                                    <div className="flex mb-1 text-xs relative" style={{ paddingLeft: '28px', height: '16px', color: 'var(--text-secondary)' }}>
                                        {monthLabels.map((m) => (
                                            <span key={m.index + m.name} className="absolute" style={{ left: `${28 + m.index * 14}px` }}>{m.name}</span>
                                        ))}
                                    </div>
                                    <div className="flex mt-2">
                                        <div className="flex flex-col justify-between text-xs mr-1 py-0.5" style={{ height: `${7 * 14}px`, color: 'var(--text-secondary)' }}>
                                            <span>Sun</span><span>Tue</span><span>Thu</span><span>Sat</span>
                                        </div>
                                        <div className="flex gap-[2px]">
                                            {calendarWeeks.map((week, wi) => (
                                                <div key={wi} className="flex flex-col gap-[2px]">
                                                    {week.map((day, di) => (
                                                        <div key={di}
                                                            className="w-3 h-3 rounded-sm"
                                                            style={{
                                                                background: day.inRange ? (getHeatColor(day.count) || 'rgba(255,255,255,0.06)') : 'transparent',
                                                            }}
                                                            title={day.inRange ? `${day.date.toDateString()}: ${day.count} submission${day.count !== 1 ? 's' : ''}` : ''} />
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-1 mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                        <span>Less</span>
                                        {[0, 1, 3, 6, 10].map((v) => (
                                            <div key={v} className="w-3 h-3 rounded-sm"
                                                style={{ background: getHeatColor(v) || 'rgba(255,255,255,0.06)' }} />
                                        ))}
                                        <span>More</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LeetCode;
