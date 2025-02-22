import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getMovieChatHistory, createChatMessage } from '../appwrite';
import { MessageCircle } from 'lucide-react';

const ChatBox = ({ movie }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (movie?.$id) {
      loadChatHistory();
    }
  }, [movie?.$id]); // Better dependency tracking

  const loadChatHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const chatHistory = await getMovieChatHistory(movie.$id);
      if (chatHistory) {
        setMessages(chatHistory);
      }
    } catch (err) {
      setError('Failed to load chat history. Please try again later.');
      console.error('Failed to load chat history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // In ChatBox.jsx, in handleSubmit:
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Submitting message for movie:', movie?.$id); // Debug log
  if (!newMessage.trim() || !isSignedIn || !movie?.$id) {
      console.log('Validation failed:', { 
          hasMessage: !!newMessage.trim(), 
          isSignedIn, 
          movieId: movie?.$id 
      }); // Debug log
      return;
  }
  
  setIsSending(true);
  
  try {
      const createdMessage = await createChatMessage(
          user.id,
          user.fullName || user.username,
          newMessage.trim(),
          movie.$id
      );
      
      if (createdMessage) {
          setMessages(prev => [...prev, createdMessage]);
          setNewMessage('');
      }
  } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
  } finally {
      setIsSending(false);
  }
};

  if (!isLoaded) {
    return <div className="container mx-auto px-4 py-6 md:py-8 text-center text-gray-400">Loading chat...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="bg-gray-800 rounded-lg p-4 md:p-6 text-center">
          <p className="text-gray-300 mb-4">Please sign in to join the discussion about this movie</p>
          <a href="/sign-in" className="bg-blue-500 hover:bg-blue-600 px-4 md:px-6 py-2 rounded-lg transition inline-block">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <MessageCircle className="text-blue-400 w-5 h-5 md:w-6 md:h-6" />
          <h2 className="text-xl md:text-2xl font-semibold">Movie Discussion</h2>
          {movie?.$id && <span className="text-gray-400 text-sm">(ID: {movie.$id})</span>}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-h-[300px] md:max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <p className="text-gray-400 text-center text-sm md:text-base">Loading chat history...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-400 text-center text-sm md:text-base">Be the first to start a discussion about this movie!</p>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.$id} 
                className={`bg-gray-700 rounded-lg p-3 md:p-4 ${msg.clerkUserId === user.id ? 'border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-1 md:mb-2">
                  <span className="font-semibold text-sm md:text-base">{msg.userName}</span>
                  <span className="text-xs md:text-sm text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm md:text-base">{msg.message}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 md:gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 bg-gray-700 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSending}
          />
          <button
            type="submit"
            className={`px-4 md:px-6 py-2 rounded-lg transition cursor-pointer text-sm md:text-base whitespace-nowrap ${
              isSending 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isSending}
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;