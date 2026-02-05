import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AppHeader from '../dashboard/AppHeader';
import GridBackground from '../landing/GridBackground';
import SEO from '../../components/SEO';
import { getIncomingRequests, getConnections, acceptConnectionRequest, declineConnectionRequest } from '../../services/relationshipService';
import toast from 'react-hot-toast';

const NodesPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('search') || '';
    const [filterQuery, setFilterQuery] = useState(initialQuery);
    const [incomingConsults, setIncomingConsults] = useState<any[]>([]);
    const [myNodes, setMyNodes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Update filter if URL changes
    useEffect(() => {
        const q = searchParams.get('search');
        if (q !== null) {
            setFilterQuery(q);
        }
    }, [searchParams]);

    const fetchData = async () => {
        try {
            const [incoming, connections] = await Promise.all([
                getIncomingRequests(),
                getConnections('connected')
            ]);
            setIncomingConsults(incoming.requests || []);
            setMyNodes(connections.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load network data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (id: number) => {
        try {
            await acceptConnectionRequest(id);
            toast.success('Connected!');
            fetchData();
        } catch (error) {
            toast.error('Failed to accept');
        }
    };

    const handleDecline = async (id: number) => {
        try {
            await declineConnectionRequest(id);
            toast.success('Request declined');
            fetchData();
        } catch (error) {
            toast.error('Failed to decline');
        }
    };

    const suggestedPeers = [
        { id: 3, name: "Dr. Emily Right", role: "Oncologist", institution: "City Hope Center", reason: "Alumni from JHU" },
        { id: 4, name: "Dr. Michael Chang", role: "Pediatrician", institution: "Children's Health", reason: "Similar Research Interests" },
        { id: 5, name: "Dr. Linda K.", role: "Dermatologist", institution: "Private Practice", reason: "Trending in your area" },
    ];

    const filteredNodes = myNodes.filter(node => {
        const name = (node.first_name + ' ' + node.last_name).toLowerCase();
        const headline = (node.headline || '').toLowerCase();
        const query = filterQuery.toLowerCase();
        return name.includes(query) || headline.includes(query);
    });

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <GridBackground />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <SEO title="Nodes" description="Manage your professional medical network." />
                <AppHeader />

                <main className="container" style={{
                    paddingTop: '100px',
                    paddingBottom: '4rem',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
                            Clinical Nodes
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                            Manage your <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Edges</span> and professional synapses.
                        </p>
                    </div>

                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading network data...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>

                            {/* LEFT COLUMN: Incoming + Suggestions (8 cols) */}
                            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                                {/* Pending Edges */}
                                <section style={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-grid)',
                                    borderRadius: '16px',
                                    padding: '24px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Pending Edges</h2>
                                        <span style={{
                                            background: 'var(--color-accent)',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700
                                        }}>{incomingConsults.length}</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {incomingConsults.length === 0 && (
                                            <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>
                                                No pending requests.
                                            </div>
                                        )}
                                        {incomingConsults.map(req => {
                                            // Handle nested user object if structure demands, usually requests return the user details directly or nested
                                            const user = req.requester || req; // Adjust based on actual API response structure
                                            const name = user.first_name ? `${user.first_name} ${user.last_name}` : user.username || 'User';

                                            return (
                                                <div key={req.id || user.id} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '16px',
                                                    background: 'var(--color-bg)',
                                                    border: '1px solid var(--color-grid)',
                                                    borderRadius: '12px'
                                                }}>
                                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-grid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                                                            {name[0]}
                                                        </div>
                                                        <div>
                                                            <Link to={`/${user.username || user.id}`} style={{ fontWeight: 600, fontSize: '1.05rem', color: 'inherit', textDecoration: 'none' }}>{name}</Link>
                                                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{user.headline || 'Medical Professional'}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                                                {/* Placeholder for mutuals */}
                                                                <span style={{ color: 'var(--color-accent)' }}>↗</span> Pending Request
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <button
                                                            onClick={() => handleDecline(user.id)}
                                                            style={{
                                                                padding: '8px 16px',
                                                                borderRadius: '20px',
                                                                border: '1px solid var(--color-grid)',
                                                                background: 'transparent',
                                                                color: 'var(--color-text-muted)',
                                                                cursor: 'pointer',
                                                                fontWeight: 600
                                                            }}>Ignore</button>
                                                        <button
                                                            onClick={() => handleAccept(user.id)}
                                                            style={{
                                                                padding: '8px 24px',
                                                                borderRadius: '20px',
                                                                border: 'none',
                                                                background: 'var(--color-fg)',
                                                                color: 'var(--color-bg)',
                                                                cursor: 'pointer',
                                                                fontWeight: 600
                                                            }}>Synapse</button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </section>

                                {/* Suggested Nodes */}
                                <section>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px' }}>Recommended Nodes</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                                        {suggestedPeers.map(peer => (
                                            <div key={peer.id} style={{
                                                background: 'var(--color-surface)',
                                                border: '1px solid var(--color-grid)',
                                                borderRadius: '16px',
                                                padding: '24px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                transition: 'transform 0.2s',
                                                cursor: 'pointer'
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                                            >
                                                <div style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '50%',
                                                    background: 'var(--color-grid)',
                                                    marginBottom: '16px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-muted)'
                                                }}>
                                                    {peer.name[4]}
                                                </div>
                                                <Link to={`/${peer.id}`} style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px', textDecoration: 'none', color: 'inherit', display: 'block' }}>{peer.name}</Link>
                                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>{peer.role}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '20px', height: '20px' }}>
                                                    {peer.reason}
                                                </div>
                                                <button style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    borderRadius: '20px',
                                                    border: '1px solid var(--color-accent)',
                                                    background: 'rgba(var(--color-accent-rgb), 0.05)',
                                                    color: 'var(--color-accent)',
                                                    cursor: 'pointer',
                                                    fontWeight: 600
                                                }}>Form Edge</button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT COLUMN: Active Edges (4 cols) - SCROLLABLE */}
                            <div style={{ gridColumn: 'span 4' }}>
                                <div style={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-grid)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    position: 'sticky',
                                    top: '100px',
                                    maxHeight: 'calc(100vh - 140px)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
                                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Active Edges</h2>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{filteredNodes.length} Nodes</span>
                                    </div>

                                    <div style={{ position: 'relative', marginBottom: '16px', flexShrink: 0 }}>
                                        <input
                                            type="text"
                                            placeholder="Filter edges..."
                                            value={filterQuery}
                                            onChange={(e) => setFilterQuery(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--color-grid)',
                                                background: 'var(--color-bg)',
                                                color: 'var(--color-fg)',
                                                fontSize: '0.85rem'
                                            }} />
                                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px' }}>🔍</span>
                                    </div>

                                    <div className="custom-scrollbar" style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px',
                                        overflowY: 'auto',
                                        flex: 1,
                                        paddingRight: '4px'
                                    }}>
                                        {filteredNodes.length === 0 && (
                                            <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>
                                                No connections found.
                                            </div>
                                        )}
                                        {filteredNodes.map(node => {
                                            const name = node.first_name ? `${node.first_name} ${node.last_name}` : node.username || 'User';
                                            return (
                                                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #333, #111)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
                                                        {name[0]}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <Link to={`/${node.username || node.id}`} style={{ fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'inherit', textDecoration: 'none', display: 'block' }}>{name}</Link>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.headline || 'Medical Professional'}</div>
                                                    </div>
                                                    <div style={{
                                                        width: '8px', height: '8px', borderRadius: '50%',
                                                        background: node.status === 'Online' ? '#4caf50' : node.status === 'Away' ? '#ff9800' : 'var(--color-text-muted)'
                                                    }} title={node.status} />
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <button style={{
                                        width: '100%',
                                        marginTop: '16px',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-grid)',
                                        background: 'var(--color-bg)',
                                        color: 'var(--color-fg)',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        flexShrink: 0
                                    }}>
                                        Manage All Edges
                                    </button>
                                </div>
                            </div>

                        </div>
                    )
                    }
                </main >
            </div >
        </div >
    );
};

export default NodesPage;
