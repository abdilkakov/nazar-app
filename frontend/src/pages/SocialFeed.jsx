import { useState, useEffect } from 'react'
import { MessageSquare, Heart, Share2, Send, Zap, Award, ChevronDown, ChevronUp } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

const PostCard = ({ post, onLike, onComment }) => {
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState(post.comments || [])
    const [submitting, setSubmitting] = useState(false)
    const toast = useToast()

    const handleSubmitComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim() || submitting) return
        setSubmitting(true)
        try {
            const res = await api.post(`/social/posts/${post.id}/comments`, { content: commentText })
            setComments([...comments, res.data])
            setCommentText('')
            toast?.success('Comment added!')
        } catch (err) {
            toast?.error('Failed to post comment')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="bg-dark-card border border-dark-border rounded-[2.5rem] p-8 card-hover">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold border border-primary-500/10 shadow-lg shadow-primary-500/5">
                    {post.user.name[0]}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold">{post.user.name}</h4>
                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Active Now</p>
                </div>
                {post.type === 'achievement' && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                        <Award size={14} /> Achievement
                    </div>
                )}
            </div>

            <p className="text-lg leading-relaxed text-gray-200 mb-8">{post.content}</p>

            <div className="flex items-center gap-8 pt-6 border-t border-dark-border">
                <button onClick={() => onLike(post.id)} className="flex items-center gap-2 group transition-all text-gray-400 hover:text-rose-500">
                    <Heart size={20} className={post.reactions?.length > 0 ? 'fill-rose-500 text-rose-500' : 'group-hover:scale-110 transition-transform'} />
                    <span className="font-medium">{post.reactions?.length || 0}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 group transition-all text-gray-400 hover:text-primary-500"
                >
                    <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{comments.length}</span>
                    {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white ml-auto">
                    <Share2 size={20} />
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-6 pt-6 border-t border-dark-border space-y-4">
                    {comments.length > 0 ? comments.map(c => (
                        <div key={c.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold shrink-0">
                                {c.user?.name?.[0] || '?'}
                            </div>
                            <div className="flex-1 bg-white/5 rounded-2xl px-4 py-3">
                                <p className="text-xs font-bold text-gray-300 mb-1">{c.user?.name || 'User'}</p>
                                <p className="text-sm text-gray-400">{c.content}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-500 text-center py-2">No comments yet</p>
                    )}

                    {/* Add comment form */}
                    <form onSubmit={handleSubmitComment} className="flex gap-3 mt-4">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500/50 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim() || submitting}
                            className="bg-primary-600 hover:bg-primary-500 px-4 py-2.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default function SocialFeed() {
    const { user } = useAuth()
    const [posts, setPosts] = useState([])
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        api.get('/company/my').then(res => {
            if (res.data.length > 0) {
                api.get(`/social/${res.data[0].id}/feed`).then(feed => {
                    setPosts(feed.data)
                    setLoading(false)
                })
            } else {
                setLoading(false)
            }
        })
    }, [])

    const handlePost = async (e) => {
        e.preventDefault()
        if (!content.trim()) return
        try {
            const companies = await api.get('/company/my')
            if (companies.data.length === 0) return

            const res = await api.post(`/social/${companies.data[0].id}/posts`, { content })
            setPosts([res.data, ...posts])
            setContent('')
            toast?.success('Post published!')
        } catch (e) {
            console.error(e)
            toast?.error('Failed to create post')
        }
    }

    const handleLike = async (postId) => {
        try {
            await api.post(`/social/posts/${postId}/reactions`, { type: 'like' })
            setPosts(posts.map(p => p.id === postId ? { ...p, reactions: p.reactions?.length > 0 ? [] : [{ userId: user.id }] } : p))
        } catch (e) {
            console.error(e)
        }
    }

    if (loading) return <div className="p-8 text-gray-500">Loading feed...</div>

    return (
        <div className="p-8 max-w-3xl mx-auto pb-32">
            <header className="mb-12">
                <h1 className="text-3xl font-bold font-outfit">Social Feed</h1>
                <p className="text-gray-400">Connect and motivate your team</p>
            </header>

            {/* Create Post */}
            <div className="mb-12 glass p-8 rounded-[2.5rem] border-white/5 shadow-xl">
                <div className="flex gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-600/20 flex items-center justify-center font-bold text-primary-500 border border-primary-500/10">
                        {user?.name?.[0]}
                    </div>
                    <form onSubmit={handlePost} className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What are your goals today?"
                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg placeholder:text-gray-600 resize-none h-24"
                        />
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex gap-2">
                                <button type="button" className="p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-lg"><Award size={20} /></button>
                                <button type="button" className="p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-lg"><Zap size={20} /></button>
                            </div>
                            <button
                                type="submit"
                                className={`px-8 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg ${content.trim() ? 'bg-primary-600 text-white shadow-primary-600/30' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
                            >
                                Post <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-8">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onLike={handleLike} />
                ))}
                {posts.length === 0 && (
                    <div className="text-center py-20 bg-dark-card rounded-[2.5rem] border border-dark-border">
                        <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-500">No activity yet. Be the first to post!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
