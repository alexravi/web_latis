import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AppHeader from '../features/dashboard/AppHeader';
import GridBackground from '../features/landing/GridBackground';
import {
    useUniversalSearch,
    useSearchPeople,
    useSearchOrganizations,
    useSearchColleges,
    useSearchGroups,
    useSearchHashtags
} from '../hooks/useSearch';
import type {
    SearchFilters,
    Person,
    Organization,
    College,
    Group,
    Topic,
    PostResult
} from '../types/search';
import RelationshipManager from '../components/profile/RelationshipManager';

const SearchResultsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    // Filters state (could be moved to URL params for deep linking)
    const [locationFilter, setLocationFilter] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');

    const baseFilters: SearchFilters = { q, limit: 20 };

    // Conditional queries based on active tab
    // We only enable the query that matches the current tab
    const universalQuery = useUniversalSearch({ ...baseFilters, type: allTypes() });
    const peopleQuery = useSearchPeople({ ...baseFilters, location: locationFilter, specialization: specialtyFilter });
    const orgQuery = useSearchOrganizations({ ...baseFilters, location: locationFilter });
    const collegeQuery = useSearchColleges({ ...baseFilters, location: locationFilter });
    const groupQuery = useSearchGroups({ ...baseFilters, location: locationFilter });
    const hashtagQuery = useSearchHashtags(baseFilters);

    function allTypes() {
        return 'people,companies,colleges,groups,topics,posts';
    }

    const isLoading =
        (type === 'all' && universalQuery.isLoading) ||
        (type === 'people' && peopleQuery.isLoading) ||
        (type === 'companies' && orgQuery.isLoading) ||
        (type === 'colleges' && collegeQuery.isLoading) ||
        (type === 'groups' && groupQuery.isLoading) ||
        (type === 'posts' && universalQuery.isLoading); // Posts usually part of universal or its own endpoint but defined in universal for now

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'people', label: 'People' },
        { id: 'companies', label: 'Companies' },
        { id: 'colleges', label: 'Colleges' },
        { id: 'groups', label: 'Groups' },
        { id: 'topics', label: 'Topics' },
        { id: 'posts', label: 'Posts' }, // Assuming posts are returned in universal search for now
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <GridBackground />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <AppHeader />

                <main className="container" style={{
                    paddingTop: '100px',
                    paddingBottom: '4rem',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                }}>
                    {/* Header Section */}
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                            Search results for "{q}"
                        </h1>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            Showing results across directory
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--color-grid)', marginBottom: '24px', overflowX: 'auto' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setSearchParams({ q, type: tab.id });
                                    // Reset local filters on tab switch
                                    setLocationFilter('');
                                    setSpecialtyFilter('');
                                }}
                                style={{
                                    padding: '12px 0',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: type === tab.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                                    color: type === tab.id ? 'var(--color-fg)' : 'var(--color-text-muted)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '32px' }}>
                        {/* Sidebar Filters - Only show for specific types */}
                        <aside className="hide-on-mobile">
                            {type !== 'all' && type !== 'topics' && type !== 'posts' && (
                                <div style={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-grid)',
                                    padding: '20px',
                                    borderRadius: '8px'
                                }}>
                                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Filters</h3>

                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 500 }}>Location</label>
                                        <input
                                            type="text"
                                            placeholder="City, State..."
                                            value={locationFilter}
                                            onChange={(e) => setLocationFilter(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                background: 'var(--color-bg)',
                                                border: '1px solid var(--color-grid)',
                                                borderRadius: '4px',
                                                color: 'var(--color-fg)',
                                                fontSize: '0.85rem'
                                            }}
                                        />
                                    </div>

                                    {(type === 'people' || type === 'groups' || type === 'companies') && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 500 }}>
                                                {type === 'people' ? 'Specialization' : type === 'companies' ? 'Specialty' : 'Specialty'}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Cardiology"
                                                value={specialtyFilter}
                                                onChange={(e) => setSpecialtyFilter(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    background: 'var(--color-bg)',
                                                    border: '1px solid var(--color-grid)',
                                                    borderRadius: '4px',
                                                    color: 'var(--color-fg)',
                                                    fontSize: '0.85rem'
                                                }}
                                            />
                                        </div>
                                    )}

                                    <button style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: 'var(--color-grid)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        marginTop: '8px'
                                    }} onClick={() => {
                                        setLocationFilter('');
                                        setSpecialtyFilter('');
                                    }}>
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </aside>

                        {/* Results Area */}
                        <div>
                            {isLoading ? (
                                <div style={{ color: 'var(--color-text-muted)' }}>Loading results...</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                                    {/* PEOPLE RESULTS */}
                                    {(type === 'all' || type === 'people') &&
                                        (type === 'all' ? universalQuery.data?.data?.people : peopleQuery.data?.data)?.length ? (
                                        <ResultSection title="People" showLink={type === 'all'} linkTo={`/search?q=${q}&type=people`}>
                                            {(type === 'all' ? universalQuery.data!.data.people! : peopleQuery.data!.data).map(person => (
                                                <PersonCard key={person.id} person={person} />
                                            ))}
                                        </ResultSection>
                                    ) : type === 'people' ? <NoResults /> : null}

                                    {/* COMPANY RESULTS */}
                                    {(type === 'all' || type === 'companies') &&
                                        (type === 'all' ? universalQuery.data?.data?.companies : orgQuery.data?.data)?.length ? (
                                        <ResultSection title="Companies" showLink={type === 'all'} linkTo={`/search?q=${q}&type=companies`}>
                                            {(type === 'all' ? universalQuery.data!.data.companies! : orgQuery.data!.data).map(org => (
                                                <OrgCard key={org.id} org={org} />
                                            ))}
                                        </ResultSection>
                                    ) : type === 'companies' ? <NoResults /> : null}

                                    {/* COLLEGE RESULTS */}
                                    {(type === 'all' || type === 'colleges') &&
                                        (type === 'all' ? universalQuery.data?.data?.colleges : collegeQuery.data?.data)?.length ? (
                                        <ResultSection title="Colleges" showLink={type === 'all'} linkTo={`/search?q=${q}&type=colleges`}>
                                            {(type === 'all' ? universalQuery.data!.data.colleges! : collegeQuery.data!.data).map((college, i) => (
                                                <CollegeCard key={i} college={college} />
                                            ))}
                                        </ResultSection>
                                    ) : type === 'colleges' ? <NoResults /> : null}

                                    {/* GROUP RESULTS */}
                                    {(type === 'all' || type === 'groups') &&
                                        (type === 'all' ? universalQuery.data?.data?.groups : groupQuery.data?.data)?.length ? (
                                        <ResultSection title="Groups" showLink={type === 'all'} linkTo={`/search?q=${q}&type=groups`}>
                                            {(type === 'all' ? universalQuery.data!.data.groups! : groupQuery.data!.data).map(group => (
                                                <GroupCard key={group.id} group={group} />
                                            ))}
                                        </ResultSection>
                                    ) : type === 'groups' ? <NoResults /> : null}

                                    {/* TOPIC RESULTS */}
                                    {(type === 'all' || type === 'topics') &&
                                        (type === 'all' ? universalQuery.data?.data?.topics : hashtagQuery.data?.data)?.length ? (
                                        <ResultSection title="Topics" showLink={type === 'all'} linkTo={`/search?q=${q}&type=topics`}>
                                            {(type === 'all' ? universalQuery.data!.data.topics! : hashtagQuery.data!.data).map(topic => (
                                                <TopicCard key={topic.id} topic={topic} />
                                            ))}
                                        </ResultSection>
                                    ) : type === 'topics' ? <NoResults /> : null}

                                    {/* POST RESULTS */}
                                    {/* Note: Assuming posts come in universal search or specific endpoint logic would be similar */}
                                    {(type === 'all' || type === 'posts') &&
                                        (universalQuery.data?.data?.posts)?.length ? (
                                        <ResultSection title="Posts" showLink={type === 'all'} linkTo={`/search?q=${q}&type=posts`}>
                                            {universalQuery.data!.data.posts!.map(post => (
                                                <PostCard key={post.id} post={post} />
                                            ))}
                                        </ResultSection>
                                    ) : type === 'posts' ? <NoResults /> : null}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// --- Sub-components ---

const ResultSection: React.FC<{ title: string, children: React.ReactNode, showLink?: boolean, linkTo?: string }> = ({ title, children, showLink, linkTo }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem' }}>{title}</h2>
            {showLink && linkTo && (
                <Link to={linkTo} style={{ textDecoration: 'none', color: 'var(--color-accent)', fontSize: '0.9rem' }}>See all</Link>
            )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {children}
        </div>
    </div>
);

const NoResults = () => (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-grid)' }}>
        No results found matching your criteria.
    </div>
);

const CardBase: React.FC<{ children: React.ReactNode, onClick?: () => void }> = ({ children, onClick }) => (
    <div onClick={onClick} style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-grid)',
        padding: '16px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        minHeight: '180px'
    }}
        onMouseEnter={(e) => { if (onClick) e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
        onMouseLeave={(e) => { if (onClick) e.currentTarget.style.borderColor = 'var(--color-grid)'; }}
    >
        {children}
    </div>
);

const Avatar: React.FC<{ src?: string, initial?: string, size?: number }> = ({ src, initial, size = 64 }) => (
    <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--color-grid)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontSize: size * 0.4,
        fontWeight: 'bold',
        color: 'var(--color-text-muted)'
    }}>
        {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
    </div>
);

const PersonCard: React.FC<{ person: Person }> = ({ person }) => (
    <Link to={`/${person.username || person.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <CardBase>
            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <Avatar src={person.profile_image_url} initial={person.first_name?.[0]} />
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{person.first_name} {person.last_name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{person.headline || person.specialization}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{person.location}</div>
                </div>
            </div>
            <div style={{ marginTop: 'auto', width: '100%' }} onClick={(e) => e.preventDefault()}>
                <RelationshipManager userId={person.id} initialRelationship={person.relationship} layout="card" />
            </div>
        </CardBase>
    </Link>
);

const OrgCard: React.FC<{ org: Organization }> = ({ org }) => (
    <CardBase>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Avatar src={org.logo_url} initial={org.name[0]} size={48} />
            <div>
                <div style={{ fontWeight: 'bold' }}>{org.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{org.organization_type}</div>
            </div>
        </div>
        <div style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            {org.location}
        </div>
        {org.specialties && (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                {org.specialties.slice(0, 3).map(s => (
                    <span key={s} style={{ fontSize: '0.7rem', background: 'var(--color-grid)', padding: '2px 6px', borderRadius: '4px' }}>{s}</span>
                ))}
            </div>
        )}
    </CardBase>
);

const CollegeCard: React.FC<{ college: College }> = ({ college }) => (
    <CardBase>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>🏛️</div>
            <div>
                <div style={{ fontWeight: 'bold' }}>{college.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{college.institution_type}</div>
            </div>
        </div>
        <div style={{ fontSize: '0.85rem' }}>{college.location}</div>
    </CardBase>
);

const GroupCard: React.FC<{ group: Group }> = ({ group }) => (
    <CardBase>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Avatar src={group.logo_url} initial={group.name[0]} size={48} />
            <div>
                <div style={{ fontWeight: 'bold' }}>{group.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{group.group_type}</div>
            </div>
        </div>
        <div style={{ fontSize: '0.85rem' }}>{group.member_count} members</div>
    </CardBase>
);

const TopicCard: React.FC<{ topic: Topic }> = ({ topic }) => (
    <CardBase>
        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>#{topic.name}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{topic.posts_count} posts</div>
    </CardBase>
);

const PostCard: React.FC<{ post: PostResult }> = ({ post }) => (
    <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-grid)',
        padding: '16px',
        borderRadius: '8px',
        width: '100%' // Full width in grid
    }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '0.9rem' }}>
            <Link to={`/${post.username || post.user_id}`} style={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'none' }}>{post.first_name} {post.last_name}</Link>
            <div style={{ color: 'var(--color-text-muted)' }}>• {new Date(post.created_at).toLocaleDateString()}</div>
        </div>
        <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{post.content}</div>
    </div>
);

export default SearchResultsPage;
