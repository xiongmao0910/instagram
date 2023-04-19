// Import library
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Like, Comments, Share, Label } from '@icon-park/react';

// Import components
import { home } from '../api';
import { useAuth } from '../contexts';
import { Slide } from '../components';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState();

    const { currentUser } = useAuth();

    /**
     * Method
     */
    async function getPosts() {
        const { success, msg, data } = await home(currentUser.id);

        if (!success) {
            // TODO Notification
            console.log(msg);
        }

        if (success) {
            setPosts(data || []);
        }

        setLoading(false);
    }

    /**
     * Side effect
     */
    useEffect(() => {
        getPosts();
    }, []);

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!posts) {
        return (
            <section className="section">
                <div className="section-container">
                    <h1>404 page</h1>
                </div>
            </section>
        );
    }

    return (
        <section className="section">
            <div className="section-container">
                {posts.length === 0 && <h1>Home page 01</h1>}
                {posts.length > 0 && (
                    <div className="home">
                        <div className="home-list flow">
                            {posts.map((post) => (
                                <div className="home-item" key={post.postId}>
                                    <div className="home-item-info d-flex items-center">
                                        <div className="home-item-img">
                                            <img
                                                src={post.photoURL}
                                                alt={post.username}
                                                className="img-fluid"
                                            />
                                        </div>
                                        <div>
                                            <Link
                                                to={`/${post.username}/`}
                                                className="fw-bold"
                                            >
                                                {post.username}
                                            </Link>{' '}
                                            •{' '}
                                            <small className="fw-thin">
                                                {post.createdAt}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="home-item-slide">
                                        <Slide media={post.media} />
                                    </div>
                                    <div className="home-item-action d-flex items-center justify-between">
                                        <div className="d-flex items-center">
                                            <div className="home-item-icon">
                                                <Like
                                                    theme={
                                                        post.isLiked
                                                            ? 'filled'
                                                            : ''
                                                    }
                                                />
                                            </div>
                                            <div className="home-item-icon">
                                                <Comments />
                                            </div>
                                            <div className="home-item-icon">
                                                <Share />
                                            </div>
                                        </div>
                                        <div className="home-item-icon">
                                            <Label />
                                        </div>
                                    </div>
                                    <div className="home-item-like fw-bold">
                                        {post.likeCount} likes
                                    </div>
                                    <div className="home-item-detail d-flex items-center">
                                        <Link
                                            to={`/${post.username}/`}
                                            className="fw-bold"
                                        >
                                            {post.username}
                                        </Link>
                                        {post.caption.length > 0 && (
                                            <p className="home-item-caption">
                                                {post.caption}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home;
