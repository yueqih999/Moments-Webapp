// This is a dynamic page for each post
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import CommentBox from '@/components/CommentBox';
import Link from 'next/link';  
import Post from '@/components/Post';
import MapBox from '../../components/MapBox';

const postPage = (props) => {
    // console.log('[post-id] props:', props)
    const router = useRouter();
    const pid = router.query['post-id'];
    const [post, setPost] = useState({});
    const user = props.user;
    const location = post.location ? { lat: post.location.lat, lng: post.location.lng } : null;

    let isPostAuthor = false;
    // detemine if the user is the author of the post 
    const postAuther = post.uid;
    if (user && postAuther === user.uid) {
        isPostAuthor = true;
    }

    // get post from the database 
    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/posts/${pid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const postData = await response.json();
            console.log('Post fetched successfully:', postData);
            //setPost(postData);
            const liked = postData.likes.includes(user.uid)
            setPost({...postData, liked});
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    }

    useEffect(() => {
        if (pid) fetchPost();
    }, [pid]);


    const deletePost = async (postId) => {
        if (!isPostAuthor) {
            alert('You are not authorized to delete this post!');
            return;
        }
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseData = await response.json();
            console.log('Post delete successfully:', responseData);
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    //like
    const toggleLike = async (postId, liked) => {
        console.log("Toggling like for post:", postId);
        try{
            const method = liked ? 'DELETE' : 'PATCH';
            const response = await fetch(`/api/posts/${postId}/like`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: user.uid}),
            });
            if (response.ok) {
                fetchPost();
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    }

    return (
        <div className="columns">
            <div className="column is-6 my-3">
                <Post 
                    key={post.id} 
                    post={post} 
                    showButton={isPostAuthor} 
                    isPost={true}
                    onDelete={() => deletePost(post.id)} 
                    onLike={() => toggleLike(post.id, post.liked)} 
                    liked={post.liked} />
            </div>

            <div className="column is-5 my-5">
                <CommentBox post={post} user={user} />
            </div> 
            {location && <MapBox location={location} />}
            <div className="column is-1 my-5">
            </div>   
        </div>
    );
}

export default postPage;
