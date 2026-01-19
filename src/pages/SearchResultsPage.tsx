import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchService } from '../services/searchService';
import toast from 'react-hot-toast';

const SearchResultsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    const [results, setResults] = useState<any>({
        people: [],
        posts: [],
        companies: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!q) return;
            setLoading(true);
            try {
                const data = await searchService.search({ q, type: type as any });
                setResults(data.data || { people: [], posts: [], companies: [] });
            } catch (error) {
                console.error('Search error:', error);
                toast.error('Failed to fetch search results');
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [q, type]);

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'people', label: 'People' },
        { id: 'posts', label: 'Posts' },
        { id: 'companies', label: 'Companies' }
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px' }}>Search Results for "{q}"</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--color-grid)', marginBottom: '20px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSearchParams({ q, type: tab.id })}
                        style={{
                            padding: '10px 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: type === tab.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                            color: type === tab.id ? 'var(--color-fg)' : 'var(--color-text-muted)',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="search-results-grid">
                    {/* People Section */}
                    {(type === 'all' || type === 'people') && results.people?.length > 0 && (
                        <div style={{ marginBottom: '40px' }}>
                            <h2>People</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                                {results.people.map((person: any) => (
                                    <Link key={person.id} to={`/profile/${person.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div style={{ border: '1px solid var(--color-grid)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                            <div style={{ width: '60px', height: '60px', background: '#ccc', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {person.profile_image_url ? (
                                                    <img src={person.profile_image_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                                ) : (
                                                    <span>{person.first_name?.[0]}</span>
                                                )}
                                            </div>
                                            <div style={{ fontWeight: 'bold' }}>{person.first_name} {person.last_name}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{person.headline}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Posts Section */}
                    {(type === 'all' || type === 'posts') && results.posts?.length > 0 && (
                        <div style={{ marginBottom: '40px' }}>
                            <h2>Posts</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {results.posts.map((post: any) => (
                                    <div key={post.id} style={{ border: '1px solid var(--color-grid)', padding: '15px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{post.first_name} {post.last_name}</div>
                                            <div style={{ color: 'var(--color-text-muted)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div>{post.content}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Companies Section */}
                    {(type === 'all' || type === 'companies') && results.companies?.length > 0 && (
                        <div style={{ marginBottom: '40px' }}>
                            <h2>Companies</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                                {results.companies.map((company: any) => (
                                    <div key={company.id} style={{ border: '1px solid var(--color-grid)', padding: '15px', borderRadius: '8px' }}>
                                        <h3 style={{ margin: '0 0 5px' }}>{company.name}</h3>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{company.organization_type} • {company.location}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {Object.values(results).every((arr: any) => arr.length === 0) && (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            No results found for "{q}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;
