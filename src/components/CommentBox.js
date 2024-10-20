import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const CommentBox = ({ post, user }) => {   
    // console.log('Comment Box post:', post);
    // console.log('Comment Box user:', user); 
    const pid = post.id;
    const router = useRouter();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');


    // get 
    const fetchComments = async () => {
        try {
            console.log('fetching comments for post:', pid);
            const response = await fetch(`/api/posts/${pid}/comments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data) {
                setComments(data);
            }
            comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]);
        }
    }

    useEffect(() => {   
        fetchComments();
    }, [pid]);

    // create/post
    const postComment = async (comment) => {
        try {
            const response = await fetch(`/api/posts/${pid}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(comment),
            });
            const responseData = await response.json();
            console.log('Comment created successfully:', responseData);
            fetchComments();
            return true
        } catch (error) {  
            console.error('Failed to create comment:', error);
            return false;
        }
    }

    const onCommentSubmitted = async (event) => {
        event.preventDefault();
        let is_posted = false;
        if (!user) {
            router.push('/login');
            console.log('user not logged in');
        } else {
            const reqData = {
                pid: pid,
                content: event.target.elements[0].value,
                author: user.displayName,
                uid: user.uid,
                createdAt: Date.now(),
            };
            // if the input is empty, do not submit and return
            if (!reqData.content) {
                alert('Comment content cannot be empty');
                return;
            }
            // clear the comment box if comment is posted successfully
            is_posted = postComment(reqData);
            if (is_posted) {
                setNewComment('');
            }        
        }  
    }


    const onCommentDeleted = async (comment) => {
        if (!user) {
            router.push('/login');
            console.log('user not logged in');
            return;
        }
        if (user.uid === post.uid || user.uid === comment.uid) {
            try {
                const response = await fetch(`/api/posts/${pid}/comments/${comment.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const responseData = await response.json();
                console.log('Comment deleted successfully:', responseData);
                fetchComments();
            } catch (error) {
                console.error('Failed to delete comment:', error);
            }
        } else {
            alert('You are not authorized to delete this comment');
        }   
    }


    return (
        <div>
            <div>
                <h1 className="title is-4">Comments</h1>
            </div>
            <hr />

            <div className="media-content">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="mb-5">
                            <div className="content">
                                <p>
                                    <strong>{comment.author}</strong> 
                                    <small>  Posted {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() + ' ' + new Date(comment.createdAt).toLocaleTimeString() : "No Date"}</small>
                                    <br />
                                    <p class="has-text-black">{comment.content}</p>
                                </p>
                                <div className="level">
                                    <div className="level-left">
                                        <a className="level-item">
                                            <span className="icon is-small has-text-dark"><i className="fas fa-heart"></i></span>
                                        </a>
                                        <a className="level-item" onClick={() => onCommentDeleted(comment)}> 
                                            <span className="icon is-small has-text-dark"><i className="fas fa-trash"></i></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    ))
                ) : (
                    <p className="subtitle is-5">No comments yet</p>
                )}
            </div>


            <div className="media my-5">
                <div className="media-content">
                    <form onSubmit={(event) => onCommentSubmitted(event)}>
                        <div className="mb-2">
                            <h1 className="subtitle is-5">Leave Your Comment Here</h1>
                        </div>
                        <div className="field">
                            <p className="control">
                                <textarea 
                                    className="textarea" 
                                    placeholder="Add a comment..."
                                    onChange={e => setNewComment(e.target.value)}
                                    value={newComment}
                                ></textarea>
                            </p>
                        </div>
                        <nav className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-info">Submit</button>
                            </div>
                            <div className="control">
                                <button type="button" className="button is-light" onClick={() => setNewComment('')}>Cancel</button>
                            </div>
                        </nav>
                    </form>
                </div>
            </div>


        </div>
        
        );
    }



export default CommentBox;