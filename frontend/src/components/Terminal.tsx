import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface HistoryItem {
  type: 'command' | 'output' | 'error';
  content: string;
}

export function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'output', content: '██████╗  ██████╗  ██████╗ ████████╗' },
    { type: 'output', content: '██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝' },
    { type: 'output', content: '██████╔╝██║   ██║██║   ██║   ██║   ' },
    { type: 'output', content: '██╔══██╗██║   ██║██║   ██║   ██║   ' },
    { type: 'output', content: '██║  ██║╚██████╔╝╚██████╔╝   ██║   ' },
    { type: 'output', content: '╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ' },
    { type: 'output', content: '' },
    { type: 'output', content: 'Welcome to ROOT Hacking Security Club' },
    { type: 'output', content: 'Type "help" for available commands' },
    { type: 'output', content: '' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: `root@memorism:~$ ${cmd}` }]);
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    if (!trimmedCmd) {
      return;
    }

    // Process commands
    switch (trimmedCmd) {
      case 'help':
        setHistory(prev => [
          ...prev,
          { type: 'output', content: 'Available commands:' },
          { type: 'output', content: '' },
          { type: 'output', content: '  help      - Show this help message' },
          { type: 'output', content: '  about     - About ROOT club' },
          { type: 'output', content: '  members   - Show club members' },
          { type: 'output', content: '  projects  - View club projects' },
          { type: 'output', content: '  contact   - Contact information' },
          { type: 'output', content: '  clear     - Clear the terminal' },
          { type: 'output', content: '  date      - Show current date' },
          { type: 'output', content: '  echo      - Echo a message (usage: echo <message>)' },
          { type: 'output', content: '' },
        ]);
        break;
        
      case 'login':
        const res = await axios.post('/api/auth/login', {
          user_id: 'test_user',
          user_pw: 'adminroot!!'
        })
        alert(res.data.message)
        break;

      case 'about':
        setHistory(prev => [
          ...prev,
          { type: 'output', content: 'ROOT - Hacking Security Club' },
          { type: 'output', content: '' },
          { type: 'output', content: 'ROOT는 해킹과 보안을 연구하는 동아리입니다.' },
          { type: 'output', content: '우리는 시스템 보안, 웹 해킹, 암호학 등을' },
          { type: 'output', content: '다양하게 학습하고 연구합니다.' },
          { type: 'output', content: '' },
        ]);
        break;

      case 'members':
        setHistory(prev => [
          ...prev,
          { type: 'output', content: 'ROOT Club Members:' },
          { type: 'output', content: '' },
          { type: 'output', content: '  [ADMIN] root@system' },
          { type: 'output', content: '  [USER]  member1@system' },
          { type: 'output', content: '  [USER]  member2@system' },
          { type: 'output', content: '  [USER]  member3@system' },
          { type: 'output', content: '' },
        ]);
        break;

      case 'projects':
        setHistory(prev => [
          ...prev,
          { type: 'output', content: 'Current Projects:' },
          { type: 'output', content: '' },
          { type: 'output', content: '  1. CTF Challenge Platform' },
          { type: 'output', content: '  2. Vulnerability Scanner' },
          { type: 'output', content: '  3. Cryptography Tools' },
          { type: 'output', content: '  4. Penetration Testing Framework' },
          { type: 'output', content: '' },
        ]);
        break;

      case 'contact':
        setHistory(prev => [
          ...prev,
          { type: 'output', content: 'Contact Information:' },
          { type: 'output', content: '' },
          { type: 'output', content: '  Email: root@security-club.com' },
          { type: 'output', content: '  GitHub: github.com/root-security' },
          { type: 'output', content: '  Discord: ROOT Security #1234' },
          { type: 'output', content: '' },
        ]);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'date':
        setHistory(prev => [
          ...prev,
          { type: 'output', content: new Date().toString() },
          { type: 'output', content: '' },
        ]);
        break;

      default:
        if (trimmedCmd.startsWith('echo ')) {
          const message = cmd.substring(5);
          setHistory(prev => [
            ...prev,
            { type: 'output', content: message },
            { type: 'output', content: '' },
          ]);
        } else {
          setHistory(prev => [
            ...prev,
            { type: 'error', content: `command not found: ${trimmedCmd}` },
            { type: 'error', content: 'Type "help" for available commands' },
            { type: 'output', content: '' },
          ]);
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      ref={terminalRef}
      className="min-h-screen bg-black text-green-400 font-mono overflow-y-auto cursor-text"
      style={{ padding: '30px' }}
      onClick={handleTerminalClick}
    >
      <div className="max-w-4xl mx-auto">
        {/* History */}
        {history.map((item, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap mb-1 ${
              item.type === 'command' 
                ? 'text-green-400' 
                : item.type === 'error'
                ? 'text-red-400'
                : 'text-gray-300'
            }`}
          >
            {item.content}
          </div>
        ))}

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-400 mr-2">root@memorism:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <span className="animate-pulse ml-1">▊</span>
        </form>
      </div>
    </div>
  );
}