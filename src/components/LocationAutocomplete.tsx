import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface City {
    id: number;
    name: string;
    state_code: string;
    state_name: string;
    country_code: string;
    country_name: string;
}

interface Props {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    className?: string; // Allow passing external classes
}

const LocationAutocomplete: React.FC<Props> = ({
    value,
    onChange,
    placeholder = "City, State",
    required = false,
    className
}) => {
    // Internal state for the input value
    const [query, setQuery] = useState(value || '');
    const [results, setResults] = useState<City[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Portal positioning state
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    // Store full dataset in state
    const [allCities, setAllCities] = useState<City[]>([]);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync query when external value prop changes
    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    // Handle clicks outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Logic change: since dropdown is in a portal, we need to check if click is in wrapper OR in the dropdown(which is now separate in DOM)
            // But we can just rely on the wrapper for the input.
            // Actually, we need to check if the click target is NOT the wrapper and NOT the portal.
            // Since the portal is disjoint, we might need a ref for the dropdown too if we want precision.
            // Simplified: If click is NOT in wrapperRef, close it.
            // Wait, if I click the portal item, that is technically outside wrapperRef.
            // So we need to stopPropagation on the portal or check containment.
            // Let's rely on the fact that clicking an item closes it anyway via handleSelect.
            // The only issue is clicking empty space in the dropdown.
            // So we'll add a ref to the dropdown content if possible, or just ignore clicks inside the dropdown.

            // Actually, simplest way: utilize event bubbling? No, portal events bubble to React tree ancestors, so e.target inside portal will look like it's inside wrapperRef for React events, 
            // BUT for native listener on document, it's outside.
            // So we need to be careful.

            // Let's skip complex outside click for now and rely on:
            // 1. Selecting an item closes it.
            // 2. Clicking elsewhere in the UI closes it.

            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                // We need to check if the target is inside the dropdown portal.
                // We can give the dropdown an ID or class to check.
                const target = event.target as HTMLElement;
                if (!target.closest('.location-autocomplete-dropdown')) {
                    setIsOpen(false);
                }
            }
        };

        // Update position on scroll/resize
        const updatePosition = () => {
            if (isOpen && wrapperRef.current) {
                const rect = wrapperRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            }
        };

        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen]);

    const loadData = async () => {
        if (isDataLoaded) return;

        setIsLoading(true);
        try {
            // Try to load from IndexedDB cache first
            const { getCachedData, setCachedData } = await import('../utils/indexedDB');
            const cachedData = await getCachedData<City[]>('cities_lite');
            
            if (cachedData) {
                console.log("Loaded cities from cache:", cachedData.length);
                setAllCities(cachedData);
                setIsDataLoaded(true);
                setIsLoading(false);
                return;
            }

            console.log("Loading cities.json...");
            // Dynamic import because file is 51MB
            const module = await import('../assets/cities_lite.json');
            // Check for default export vs direct array
            const data = (module.default || module) as City[];
            console.log("Loaded cities:", data.length);
            
            // Cache in IndexedDB (expires in 7 days)
            await setCachedData('cities_lite', data, 1000 * 60 * 60 * 24 * 7);
            
            setAllCities(data);
            setIsDataLoaded(true);
        } catch (error) {
            console.error("Failed to load cities data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = useCallback((searchText: string) => {
        setQuery(searchText);
        onChange(searchText); // Allow setting free text value immediately

        // Trigger load if not loaded (though onFocus should have caught it)
        if (!isDataLoaded) loadData();

        if (searchText.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        if (!isDataLoaded) return; // Wait for load

        const lowerQuery = searchText.toLowerCase();
        const filtered: City[] = [];

        for (let i = 0; i < allCities.length; i++) {
            const city = allCities[i];

            // Robust check for null properties just in case
            const cName = city.name ? city.name.toLowerCase() : '';
            const cState = city.state_name ? city.state_name.toLowerCase() : '';
            const cCountry = city.country_name ? city.country_name.toLowerCase() : '';

            // Match Logic
            if (cName.includes(lowerQuery) || cState.includes(lowerQuery) || cCountry.includes(lowerQuery)) {
                filtered.push(city);
                if (filtered.length >= 50) break; // Limit results
            }
        }

        setResults(filtered);
        setIsOpen(true);
    }, [isDataLoaded, allCities, onChange]);

    const handleFocus = useCallback(() => {
        loadData();
        // Update position immediately just in case
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, []);

    const handleSelect = useCallback((city: City) => {
        const parts = [city.name];
        if (city.state_name) parts.push(city.state_name);
        parts.push(city.country_code);

        const locationString = parts.join(', ');

        setQuery(locationString);
        onChange(locationString);
        setIsOpen(false);
    }, [onChange]);

    // Portal Content
    const dropdownContent = (
        <div
            className="location-autocomplete-dropdown"
            style={{
                position: 'absolute',
                top: coords.top + 4,
                left: coords.left,
                width: coords.width,
                zIndex: 10000, // Very high Z-Index
                background: 'white',
                border: '1px solid var(--color-grid)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                maxHeight: '250px',
                overflowY: 'auto'
            }}
        >
            {isLoading && (
                <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: '#888' }}>
                    Loading cities...
                </div>
            )}

            {!isLoading && results.length > 0 && (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {results.map((city) => (
                        <li
                            key={city.id}
                            onClick={() => handleSelect(city)}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                            style={{
                                padding: '10px 14px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                background: 'white',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-fg)' }}>
                                {city.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                {city.state_name ? `${city.state_name}, ` : ''}{city.country_name}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && query.length >= 2 && results.length === 0 && isDataLoaded && (
                <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: '#888' }}>
                    No results found
                </div>
            )}
        </div>
    );

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <input
                type="text"
                className={className}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={handleFocus}
                placeholder={placeholder}
                required={required}
                style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--color-grid)',
                    background: 'white',
                    color: 'var(--color-text-main)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
            />
            {isOpen && createPortal(dropdownContent, document.body)}
        </div>
    );
};

export default React.memo(LocationAutocomplete);
