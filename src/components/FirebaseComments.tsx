import React, { useEffect, useState } from 'react';
import { MessageSquareText, Sparkles, Send, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Comment {
  id: string;
  name: string;
  content: string;
  timestamp: number;
  adminReply?: string;
}

interface FirebaseCommentsProps {
  lang: 'zh' | 'en' | 'ja';
  t: any;
}

const FIREBASE_URL = 'https://ponpon-fans-default-rtdb.firebaseio.com/comments.json';
const NAME_MAX = 30;
const CONTENT_MAX = 500;

const FirebaseComments: React.FC<FirebaseCommentsProps> = ({ lang, t }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await fetch(FIREBASE_URL);
      const data = await res.json();
      if (data && !data.error) {
        const parsedComments = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Sort descending by timestamp
        parsedComments.sort((a, b) => b.timestamp - a.timestamp);
        setComments(parsedComments);
      } else {
        if (data?.error) {
          console.error('Firebase Error:', data.error);
        }
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchComments, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim().slice(0, NAME_MAX);
    const trimmedContent = content.trim().slice(0, CONTENT_MAX);
    if (!trimmedName || !trimmedContent) return;

    setIsSubmitting(true);
    const newComment = {
      name: trimmedName,
      content: trimmedContent,
      timestamp: Date.now(),
    };

    try {
      await fetch(FIREBASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment)
      });

      // Send Telegram notification (Use GET to avoid CORS preflight issues in browsers)
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
      if (botToken && chatId) {
        const text = `🎉 粉絲網站有新留言囉！\n\n👤 暱稱：${newComment.name}\n💬 內容：${newComment.content}`;
        const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;
        fetch(tgUrl, { method: 'GET' }).catch(err => console.error('TG error', err));
      }

      setName('');
      setContent('');
      await fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(
      lang === 'zh' ? 'zh-TW' : lang === 'ja' ? 'ja-JP' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  const getPlaceholderName = () => {
    if (lang === 'zh') return '你的暱稱';
    if (lang === 'ja') return 'ニックネーム';
    return 'Your Name';
  };

  const getPlaceholderContent = () => {
    if (lang === 'zh') return '想對 Ponpon 說些什麼呢...';
    if (lang === 'ja') return 'Ponponに何か伝えたいですか...';
    return 'What would you like to say to Ponpon...';
  };

  const getSubmitText = () => {
    if (isSubmitting) {
      if (lang === 'zh') return '發送中...';
      if (lang === 'ja') return '送信中...';
      return 'Sending...';
    }
    if (lang === 'zh') return '送出留言';
    if (lang === 'ja') return 'コメントを送信';
    return 'Send Comment';
  };

  return (
    <div className="w-full" id="fan-lounge">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 cursor-default">
          <div className="p-2 rounded-lg bg-amber-500/10 transition-colors hover:bg-amber-500/20">
            <MessageSquareText className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">FAN LOUNGE</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-500">{t.tag_no_login}</span>
        </div>
      </div>

      {/* Welcome Box */}
      <div className="mb-10 p-6 rounded-xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-12 h-12 text-amber-500" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-white mb-2">{t.welcome_title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {t.welcome_p1}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t.welcome_p2}
          </p>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {lang === 'zh' ? '暱稱' : lang === 'ja' ? '名前' : 'Name'}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={getPlaceholderName()}
              required
              maxLength={NAME_MAX}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {lang === 'zh' ? '留言內容' : lang === 'ja' ? 'コメント' : 'Message'}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={getPlaceholderContent()}
            required
            rows={4}
            maxLength={CONTENT_MAX}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all resize-y"
          />
          <div className="mt-1 text-right text-xs text-gray-500 tabular-nums">
            {content.length} / {CONTENT_MAX}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !content.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-dark font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send className="w-4 h-4" />
          <span>{getSubmitText()}</span>
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          {lang === 'zh' ? '最新留言' : lang === 'ja' ? '最新のコメント' : 'Latest Comments'}
          <span className="text-sm font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
            {comments.length}
          </span>
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white/[0.01] rounded-xl border border-white/5">
            {lang === 'zh' ? '目前還沒有留言，來搶頭香吧！' :
             lang === 'ja' ? 'まだコメントがありません。最初のコメントを書きましょう！' :
             'No comments yet. Be the first to comment!'}
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-amber-500/20 flex items-center justify-center border border-gold/20">
                      <span className="text-gold font-bold text-lg">
                        {comment.name ? comment.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{comment.name || 'Anonymous'}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(comment.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap pl-[52px]">
                  {comment.content}
                </p>

                {/* Admin Reply Display (edited from the Firebase console) */}
                {comment.adminReply && (
                  <div className="mt-4 ml-[52px] pl-4 border-l-2 border-gold/50 bg-gold/5 p-3 rounded-r-xl">
                    <div className="text-gold font-bold text-xs mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {lang === 'zh' ? '管理員回覆：' : lang === 'ja' ? '管理人からの返信：' : 'Admin Reply:'}
                    </div>
                    <div className="text-gray-300 text-sm whitespace-pre-wrap">{comment.adminReply}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default FirebaseComments;
