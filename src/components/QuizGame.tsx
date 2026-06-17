import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, CheckCircle2, XCircle, ChevronRight, Timer, Star, Music, Heart, Award, Zap } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { QuizQuestion } from '../data/quiz';
import { useNavigate } from 'react-router-dom';

const QUESTIONS_PER_GAME = 10;

export default function QuizGame() {
  const { t } = useTranslation();
  const quizTranslations = (t as any)?.quiz;
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Get localized questions with defensive check
  const questionsArray = Array.isArray(quizTranslations?.questions) ? quizTranslations.questions as QuizQuestion[] : [];

  const shuffleAndPick = (array: QuizQuestion[], count: number) => {
    if (!array || array.length === 0) return [];
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const startBatch = () => {
    if (questionsArray.length === 0) return;
    const picked = shuffleAndPick(questionsArray, QUESTIONS_PER_GAME);
    setCurrentQuestions(picked);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setShowExplanation(false);
    setSelectedOption(null);
  };

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    if (optionIndex === currentQuestions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      setGameState('result');
    }
  };

  const totalScore = score * 10;
  
  const getRank = () => {
    if (totalScore === 100) return { 
      title: quizTranslations?.rank_senior || 'Senior Fan', 
      desc: quizTranslations?.rank_senior_desc || '', 
      icon: <Trophy className="w-16 h-16 text-gold" />,
      color: "text-gold"
    };
    if (totalScore >= 80) return { 
      title: quizTranslations?.rank_loyal || 'Loyal Fan', 
      desc: quizTranslations?.rank_loyal_desc || '', 
      icon: <Star className="w-16 h-16 text-gold-light" />,
      color: "text-gold-light"
    };
    if (totalScore >= 60) return { 
      title: quizTranslations?.rank_entry || 'Entry Fan', 
      desc: quizTranslations?.rank_entry_desc || '', 
      icon: <Heart className="w-16 h-16 text-red-400" />,
      color: "text-red-400"
    };
    if (totalScore >= 40) return { 
      title: quizTranslations?.rank_passing || 'Passing Fan', 
      desc: quizTranslations?.rank_passing_desc || '', 
      icon: <Music className="w-16 h-16 text-blue-400" />,
      color: "text-blue-400"
    };
    if (totalScore >= 20) return { 
      title: quizTranslations?.rank_visitor || 'Visitor', 
      desc: quizTranslations?.rank_visitor_desc || '', 
      icon: <Award className="w-16 h-16 text-green-400" />,
      color: "text-green-400"
    };
    return { 
      title: quizTranslations?.rank_newbie || 'Newbie', 
      desc: quizTranslations?.rank_newbie_desc || '', 
      icon: <Zap className="w-16 h-16 text-gray-400" />,
      color: "text-gray-400"
    };
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="bg-dark/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Progress Background */}
        {gameState === 'playing' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / Math.max(1, currentQuestions.length)) * 100}%` }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <div className="inline-block p-4 bg-gold/10 rounded-2xl mb-6">
                <Trophy className="w-12 h-12 text-gold" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-gold mb-6">{quizTranslations?.title || 'Ponpon Quiz'}</h2>
              <p className="text-gray-300 text-lg mb-10 leading-relaxed" dangerouslySetInnerHTML={{ __html: quizTranslations?.description || 'Test your knowledge!' }} />
              <button 
                onClick={startBatch}
                className="group relative px-12 py-4 bg-gold text-dark font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                  {quizTranslations?.start || 'Start'} <ChevronRight className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && currentQuestions[currentIndex] && (
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative z-10"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xs tracking-widest uppercase text-gold/60 font-bold flex items-center gap-2">
                  <Timer className="w-4 h-4" /> {(quizTranslations?.question_label || 'Question {{current}} / {{total}}').replace('{{current}}', (currentIndex + 1).toString()).replace('{{total}}', currentQuestions.length.toString())}
                </span>
                <span className="px-4 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold">
                  {quizTranslations?.points_label || 'Score'}: {score * 10}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-medium text-white mb-8 leading-tight">
                {currentQuestions[currentIndex].question}
              </h3>

              <div className="grid gap-4 mb-10">
                {currentQuestions[currentIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedOption !== null}
                    className={`
                      w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                      ${selectedOption === null 
                        ? 'border-white/10 hover:border-gold/50 hover:bg-white/5' 
                        : idx === currentQuestions[currentIndex].correctAnswer
                          ? 'border-green-500/50 bg-green-500/10 text-green-200'
                          : selectedOption === idx
                            ? 'border-red-500/50 bg-red-500/10 text-red-200'
                            : 'border-white/5 opacity-50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-lg">{option}</span>
                      {selectedOption !== null && idx === currentQuestions[currentIndex].correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {selectedOption === idx && idx !== currentQuestions[currentIndex].correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-10 p-6 bg-white/5 border border-white/10 rounded-2xl"
                >
                  <p className="text-sm font-bold mb-2 flex items-center gap-2">
                    {selectedOption === currentQuestions[currentIndex].correctAnswer 
                      ? <span className="text-green-400">{quizTranslations?.correct_label || 'Correct!'}</span>
                      : <span className="text-red-400">{quizTranslations?.wrong_label || 'Wrong!'}: {currentQuestions[currentIndex].options[currentQuestions[currentIndex].correctAnswer]}</span>
                    }
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {currentQuestions[currentIndex].explanation}
                  </p>
                </motion.div>
              )}

              {selectedOption !== null && (
                <button
                  onClick={nextQuestion}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  {currentIndex === currentQuestions.length - 1 ? (quizTranslations?.view_result || 'View Results') : (quizTranslations?.next || 'Next')} <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center relative z-10"
            >
              <div className="mb-6 flex justify-center">
                {getRank().icon}
              </div>
              <h2 className="text-4xl font-serif text-white mb-2">{quizTranslations?.completed || 'Challenge Completed!'}</h2>
              <p className={`text-2xl font-bold mb-2 ${getRank().color}`}>{getRank().title}</p>
              <p className="text-gray-400 text-sm mb-8">{getRank().desc}</p>
              
              <div className="flex justify-center gap-12 mb-12">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{quizTranslations?.total_score || 'Total Score'}</p>
                  <p className="text-4xl font-serif text-gold">{totalScore}</p>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{quizTranslations?.accuracy || 'Accuracy'}</p>
                  <p className="text-4xl font-serif text-gold">{Math.round((score / Math.max(1, currentQuestions.length)) * 100)}%</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={startBatch}
                  className="group relative flex items-center justify-center gap-3 py-4 px-12 bg-gold text-dark font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> 
                  <span>{quizTranslations?.try_again || 'Try Again'}</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="group relative flex items-center justify-center gap-3 py-4 px-12 bg-dark-lighter border border-white/20 text-white font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:border-white/50 active:scale-95"
                >
                  <span>{quizTranslations?.back_to_about || '回到關於'}</span>
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
