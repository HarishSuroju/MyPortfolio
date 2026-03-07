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
        if (count === 0) return 'bg-gray-200';
        if (count <= 2) return 'bg-green-300';
        if (count <= 5) return 'bg-green-500';
        if (count <= 9) return 'bg-green-600';
        return 'bg-green-800';
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
            <div className="flex-1 bg-white rounded-xl p-4 shadow">
                <div className="flex justify-between items-baseline mb-2">
                    <span className={`font-bold ${color}`}>{label}</span>
                    <span className="text-gray-500 text-sm">{solved}/{total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: `${pct}%` }} />
                </div>
            </div>
        );
    };

    // ---- states ----
    if (!username && !isAuthenticated) return null;

    if (!username && isAuthenticated) {
        return (
            <section id="leetcode" className="section py-20 px-6 bg-gradient-to-br from-amber-50 to-orange-100">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">LeetCode Profile</h2>
                    <p className="text-gray-600 mb-6">Set your LeetCode username to display your profile stats.</p>
                    <div className="inline-flex items-center space-x-2">
                        <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                            placeholder="Enter LeetCode username" className="px-4 py-2 border border-gray-300 rounded-lg"
                            onKeyDown={(e) => e.key === 'Enter' && saveUsername()} />
                        <button onClick={saveUsername} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">Save</button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="leetcode" className="section py-20 px-6 bg-gradient-to-br from-amber-50 to-orange-100">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className="text-center flex-1">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">LeetCode Profile</h2>
                        <div className="flex items-center justify-center space-x-2 text-gray-600">
                            {editingUsername ? (
                                <div className="flex items-center space-x-2">
                                    <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                                        className="px-3 py-1 border border-gray-300 rounded" autoFocus
                                        onKeyDown={(e) => { if (e.key === 'Enter') saveUsername(); if (e.key === 'Escape') setEditingUsername(false); }} />
                                    <button onClick={saveUsername} className="text-green-600 hover:text-green-700"><Save size={18} /></button>
                                    <button onClick={() => setEditingUsername(false)} className="text-red-500 hover:text-red-600"><X size={18} /></button>
                                </div>
                            ) : (
                                <>
                                    <Code size={18} />
                                    <span className="font-medium">{username}</span>
                                    {isAuthenticated && (
                                        <button onClick={() => { setUsernameInput(username); setEditingUsername(true); }} className="text-gray-400 hover:text-gray-600">
                                            <Edit size={16} />
                                        </button>
                                    )}
                                    <a href={`https://leetcode.com/u/${encodeURIComponent(username)}`} target="_blank" rel="noopener noreferrer"
                                       className="text-orange-500 hover:text-orange-600 ml-2"><ExternalLink size={16} /></a>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block w-10 h-10 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
                        <p className="mt-4 text-gray-500">Fetching LeetCode stats...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl shadow p-8">
                        <p className="text-red-500 mb-4">{error}</p>
                    </div>
                )}

                {profile && !loading && (
                    <div className="space-y-8">
                        {/* Stats summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-6 shadow text-center">
                                <Target className="mx-auto mb-2 text-orange-500" size={28} />
                                <div className="text-3xl font-bold text-gray-900">{solved?.totalSolved ?? profile?.totalSolved ?? 0}</div>
                                <div className="text-gray-500 text-sm">Problems Solved</div>
                                <div className="text-xs text-gray-400 mt-1">of {solved?.totalQuestions ?? profile?.totalQuestions ?? '?'}</div>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow text-center">
                                <Trophy className="mx-auto mb-2 text-yellow-500" size={28} />
                                <div className="text-3xl font-bold text-gray-900">{(solved?.ranking || profile?.ranking) ? (solved?.ranking || profile?.ranking).toLocaleString() : 'N/A'}</div>
                                <div className="text-gray-500 text-sm">Global Ranking</div>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow text-center">
                                <Flame className="mx-auto mb-2 text-red-500" size={28} />
                                <div className="text-3xl font-bold text-gray-900">{contest?.contestRating ? Math.round(contest.contestRating) : 'N/A'}</div>
                                <div className="text-gray-500 text-sm">Contest Rating</div>
                                {contest?.contestTopPercentage && (
                                    <div className="text-xs text-gray-400 mt-1">Top {contest.contestTopPercentage.toFixed(1)}%</div>
                                )}
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow text-center">
                                <Code className="mx-auto mb-2 text-violet-500" size={28} />
                                <div className="text-3xl font-bold text-gray-900">{contest?.contestAttend ?? 'N/A'}</div>
                                <div className="text-gray-500 text-sm">Contests Attended</div>
                            </div>
                        </div>

                        {/* Difficulty breakdown */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <DifficultyBar label="Easy" solved={solved?.easySolved ?? profile?.easySolved ?? 0} total={solved?.totalEasy ?? profile?.totalEasy ?? 0} color="text-green-500" />
                            <DifficultyBar label="Medium" solved={solved?.mediumSolved ?? profile?.mediumSolved ?? 0} total={solved?.totalMedium ?? profile?.totalMedium ?? 0} color="text-yellow-500" />
                            <DifficultyBar label="Hard" solved={solved?.hardSolved ?? profile?.hardSolved ?? 0} total={solved?.totalHard ?? profile?.totalHard ?? 0} color="text-red-500" />
                        </div>

                        {/* Skills */}
                        {skills?.data?.matchedUser?.tagProblemCounts && (
                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
                                {['advanced', 'intermediate', 'fundamental'].map((tier) => {
                                    const tags = skills.data.matchedUser.tagProblemCounts[tier];
                                    if (!tags || tags.length === 0) return null;
                                    const tierColors = { advanced: 'bg-red-100 text-red-700', intermediate: 'bg-blue-100 text-blue-700', fundamental: 'bg-green-100 text-green-700' };
                                    return (
                                        <div key={tier} className="mb-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${tierColors[tier]}`}>{tier}</span>
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag) => (
                                                    <span key={tag.tagSlug} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                        {tag.tagName} <span className="text-gray-400">×{tag.problemsSolved}</span>
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
                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Submission Calendar</h3>
                                <div className="overflow-x-auto">
                                    <div className="flex mb-1 text-xs text-gray-400 relative" style={{ paddingLeft: '28px', height: '16px' }}>
                                        {monthLabels.map((m) => (
                                            <span key={m.index + m.name} className="absolute" style={{ left: `${28 + m.index * 14}px` }}>{m.name}</span>
                                        ))}
                                    </div>
                                    <div className="flex mt-2">
                                        <div className="flex flex-col justify-between text-xs text-gray-400 mr-1 py-0.5" style={{ height: `${7 * 14}px` }}>
                                            <span>Sun</span><span>Tue</span><span>Thu</span><span>Sat</span>
                                        </div>
                                        <div className="flex gap-[2px]">
                                            {calendarWeeks.map((week, wi) => (
                                                <div key={wi} className="flex flex-col gap-[2px]">
                                                    {week.map((day, di) => (
                                                        <div key={di}
                                                            className={`w-3 h-3 rounded-sm ${day.inRange ? getHeatColor(day.count) : 'bg-transparent'}`}
                                                            title={day.inRange ? `${day.date.toDateString()}: ${day.count} submission${day.count !== 1 ? 's' : ''}` : ''} />
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-1 mt-3 text-xs text-gray-400">
                                        <span>Less</span>
                                        {[0, 1, 3, 6, 10].map((v) => (
                                            <div key={v} className={`w-3 h-3 rounded-sm ${getHeatColor(v)}`} />
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
