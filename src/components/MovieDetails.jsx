import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, Star, Clock, Calendar, Globe, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatBox from './ChatBox';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://api.themoviedb.org/3';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}?append_to_response=credits,videos`,
          API_OPTIONS
        );
        const data = await response.json();
        setMovie(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // const handleSubmitMessage = (e) => {
  //   e.preventDefault();
  //   if (!newMessage.trim()) return;

  //   const message = {
  //     id: Date.now(),
  //     text: newMessage,
  //     timestamp: new Date().toISOString(),
  //     user: 'User'
  //   };

  //   setMessages([...messages, message]);
  //   setNewMessage('');
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div 
        className="relative min-h-[60vh] md:h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), 
          url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        }}
      >
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 bg-gray-800/50 px-3 py-1 md:px-4 md:py-2 rounded-full hover:bg-gray-700/50 transition text-sm md:text-base"
        >
          <ArrowLeft size={16} className="md:w-5 md:h-5" />
          Back
        </button>
        
        <div className="container mx-auto px-4 pt-16 md:pt-20">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-48 md:w-44 rounded-lg shadow-xl"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold mb-4">{movie.title}</h1>
              
              {/* Movie Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 mb-4">
                <div className="flex items-center gap-1 md:gap-2">
                  <Star className="text-yellow-400 w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{movie.runtime} min</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{movie.release_date.split('-')[0]}</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <Globe className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{movie.original_language.toUpperCase()}</span>
                </div>
              </div>

              <p className="text-gray-300 mb-4 text-sm md:text-base">{movie.overview}</p>
              
              {/* Genres */}
              <div className="mb-4">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {movie.genres.map(genre => (
                    <span 
                      key={genre.id}
                      className="bg-blue-500/20 px-2 md:px-3 py-1 rounded-full text-blue-400 text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <ChatBox movie={{ $id: id }} /> 
    </div>
  );
};

export default MovieDetailsPage;