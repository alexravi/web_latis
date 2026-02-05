import React, { useState, useRef } from 'react';

interface MessageInputProps {
    onSend: (content: string) => void;
    onTyping?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, onTyping }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim()) {
            onSend(message.trim());
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        if (onTyping) onTyping();

        // Auto-resize
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-end gap-3 bg-white dark:bg-gray-800 rounded-2xl relative">
            <button type="button" className="p-3 text-gray-400 hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </button>

            <div className="flex-1 py-3">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-500 resize-none max-h-32 text-base leading-relaxed"
                    rows={1}
                    style={{ minHeight: '24px' }}
                />
            </div>

            <button
                type="submit"
                disabled={!message.trim()}
                className={`p-3 rounded-xl transition-all duration-200 ${message.trim()
                        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 transform'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-700 cursor-not-allowed'
                    }`}
            >
                <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
        </form>
    );
};

export default MessageInput;
