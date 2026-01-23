import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutocomplete } from '../../hooks/useSearch';
import type { Person, Organization, College, Topic } from '../../types/search';

interface SearchAutocompleteProps {
    placeholder?: string;
    width?: string;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
    placeholder = "Search directory, drugs, or conditions...",
    width = "300px"
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, isLoading } = useAutocomplete(query);
    const results = data?.data;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Auto-open when we have results and query is active
    useEffect(() => {
        if (query.length >= 2 && (isLoading || results)) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [query, results, isLoading]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsOpen(false);
            navigate(`/search?q=${encodeURIComponent(query)}`);
            inputRef.current?.blur();
        }
    };

    const handleSelect = (type: string, id: string | number) => {
        setIsOpen(false);
        setQuery('');

        switch (type) {
            case 'people':
                navigate(`/${id}`);
                break;
            case 'companies':
            case 'colleges':
                // navigate(`/organizations/${id}`);
                // Fallback to search for now if org pages don't exist
                navigate(`/search?q=${encodeURIComponent(query)}&type=${type}`);
                break;
            case 'groups':
                // navigate(`/groups/${id}`);
                navigate(`/search?q=${encodeURIComponent(query)}&type=${type}`);
                break;
            case 'topics':
                navigate(`/search?q=${encodeURIComponent(String(id))}&type=posts`);
                break;
            default:
                navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width }}>
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (query.length >= 2) setIsOpen(true);
                }}
                style={{
                    background: 'var(--color-accent-subtle)',
                    border: 'none',
                    padding: '8px 16px',
                    width: '100%',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--color-fg)',
                    outline: 'none',
                    borderRadius: '4px'
                }}
            />
            <span style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.8rem',
                opacity: 0.5,
                pointerEvents: 'none'
            }}>⌘K</span>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-grid)',
                    borderRadius: '0 0 4px 4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    marginTop: '4px'
                }}>
                    {isLoading ? (
                        <div style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Loading...</div>
                    ) : results ? (
                        <>
                            {results.people && results.people.length > 0 && (
                                <Section title="PEOPLE">
                                    {results.people.map((person: Person) => (
                                        <Item
                                            key={`p-${person.id}`}
                                            onClick={() => handleSelect('people', person.username || person.id)}
                                            image={person.profile_image_url}
                                            initial={person.first_name?.[0]}
                                            primary={`${person.first_name} ${person.last_name}`}
                                            secondary={person.headline || person.specialization}
                                        />
                                    ))}
                                </Section>
                            )}

                            {results.companies && results.companies.length > 0 && (
                                <Section title="ORGANIZATIONS">
                                    {results.companies.map((org: Organization) => (
                                        <Item
                                            key={`o-${org.id}`}
                                            onClick={() => handleSelect('companies', org.id)}
                                            image={org.logo_url}
                                            initial={org.name[0]}
                                            primary={org.name}
                                            secondary={org.organization_type}
                                        />
                                    ))}
                                </Section>
                            )}

                            {results.colleges && results.colleges.length > 0 && (
                                <Section title="COLLEGES">
                                    {results.colleges.map((college: College, i: number) => (
                                        <Item
                                            key={`c-${i}`}
                                            onClick={() => handleSelect('colleges', college.name)} // Pass name if id not avail
                                            initial={college.name[0]}
                                            primary={college.name}
                                            secondary={college.location}
                                        />
                                    ))}
                                </Section>
                            )}

                            {results.topics && results.topics.length > 0 && (
                                <Section title="TOPICS">
                                    {results.topics.map((topic: Topic) => (
                                        <Item
                                            key={`t-${topic.id}`}
                                            onClick={() => handleSelect('topics', topic.name)}
                                            initial="#"
                                            primary={`#${topic.name}`}
                                            secondary={`${topic.posts_count} posts`}
                                        />
                                    ))}
                                </Section>
                            )}

                            {/* Empty State */}
                            {!results.people?.length && !results.companies?.length && !results.colleges?.length && !results.topics?.length && (
                                <div style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    No results found. Press Enter to search all.
                                </div>
                            )}

                            <div
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate(`/search?q=${encodeURIComponent(query)}`);
                                }}
                                style={{
                                    padding: '12px',
                                    borderTop: '1px solid var(--color-grid)',
                                    color: 'var(--color-accent)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}
                            >
                                View all results for "{query}"
                            </div>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ padding: '8px 0' }}>
        <div style={{ paddingLeft: '12px', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
            {title}
        </div>
        {children}
    </div>
);

interface ItemProps {
    image?: string;
    initial?: string;
    primary: string;
    secondary?: string;
    onClick: () => void;
}

const Item: React.FC<ItemProps> = ({ image, initial, primary, secondary, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            cursor: 'pointer',
            transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-subtle)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
        <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--color-grid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            fontSize: '0.8rem',
            fontWeight: 600
        }}>
            {image ? (
                <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                initial
            )}
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {primary}
            </div>
            {secondary && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {secondary}
                </div>
            )}
        </div>
    </div>
);

export default SearchAutocomplete;
