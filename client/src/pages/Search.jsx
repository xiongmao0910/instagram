// Import library
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { People } from '@icon-park/react';

// Import components
import { useDebounce } from '../hooks';
import { searchUser } from '../api';

const Search = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const debouncedSearch = useDebounce({ value: search });

    /**
     * Method
     */
    async function getSearchUsers() {
        console.log('fetching data');
        const { success, msg, data } = await searchUser({
            query: debouncedSearch,
        });

        if (!success) {
            // TODO Notification
            console.log(msg);
            setResults(null);
        }

        if (success) {
            setResults(data);
        }
    }

    /**
     * Side effect
     */
    useEffect(() => {
        if (!debouncedSearch) {
            if (results.length > 0) setResults([]);
            return;
        }

        if (debouncedSearch) {
            getSearchUsers();
        }
    }, [debouncedSearch]);

    return (
        <section className="section">
            <div className="section-container">
                <div className="search">
                    <div className="search-header">
                        <input
                            type="text"
                            value={search}
                            className="search-input"
                            onChange={(e) => setSearch(e.target.value)}
                            id="search"
                            name="search"
                            placeholder="Search..."
                        />
                    </div>
                    {results.length === 0 && !search && (
                        <div
                            className="flow"
                            style={{
                                textAlign: 'center',
                                paddingBlock: '2rem',
                            }}
                        >
                            <div className="fs-600">
                                <People theme="filled" />
                            </div>
                            <div className="fs-400 fw-bold">Search people</div>
                            <p>Once you follow people, you'll see them here.</p>
                        </div>
                    )}
                    {results.length === 0 && search && <h1>No data user</h1>}
                    {results.length > 0 && (
                        <div className="list flow">
                            {results.map((result) => {
                                return (
                                    <div
                                        key={result.id}
                                        className="list-item list-item-color"
                                    >
                                        <div className="list-info">
                                            <Link
                                                to={`/${result.username}/`}
                                                className="list-img"
                                            >
                                                <img
                                                    src={result.photoURL}
                                                    alt={result.fullname}
                                                    className="img-fluid"
                                                />
                                            </Link>
                                            <div>
                                                <Link
                                                    to={`/${result.username}/`}
                                                    className="fw-bold"
                                                >
                                                    {result.username}
                                                </Link>
                                                <p>{result.fullname}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Search;
