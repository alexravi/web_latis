import React, { useState, useRef } from 'react';

interface MessageInputProps {
    onSend: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!content.trim()) return;

        onSend(content);
        setContent('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        // Auto-resize
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full bg-transparent border-none focus:ring-0 p-1 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none max-h-32 text-sm md:text-base"
                    style={{ minHeight: '24px' }}
                />
            </div>
            <button
                type="submit"
                disabled={!content.trim()}
                className={`p-3 rounded-full flex-shrink-0 transition-colors ${content.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
            >
                <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
            </button>
        </form>
    );
};

export default MessageInput;
