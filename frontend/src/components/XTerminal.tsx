import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import axios from 'axios';

const WELCOME_MESSAGE = [
  "\x1b[37m██████╗  ██████╗  ██████╗ ████████╗\x1b[0m",
  "\x1b[37m██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝\x1b[0m",
  "\x1b[37m██████╔╝██║   ██║██║   ██║   ██║   \x1b[0m",
  "\x1b[37m██╔══██╗██║   ██║██║   ██║   ██║   \x1b[0m",
  "\x1b[37m██║  ██║╚██████╔╝╚██████╔╝   ██║   \x1b[0m",
  "\x1b[37m╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   \x1b[0m",
  "",
  "\x1b[37mWelcome to ROOT Hacking Security Club\x1b[0m",
  '\x1b[37mType "help" for available commands\x1b[0m',
  "",
].join("\r\n");

const PROMPT =
  "\x1b[92mroot@memorism:~$ \x1b[0m";

export function XTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const currentLineRef = useRef("");
  const commandHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm
    const term = new XTerm({
      cursorBlink: true,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      theme: {
        background: "#000000",
        foreground: "#00ff00",
        cursor: "#00ff00",
        selection: "#00ff0055",
      },
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Write welcome message
    term.write(WELCOME_MESSAGE);
    term.write(PROMPT);

    // Handle input
    term.onData((data) => {
      const code = data.charCodeAt(0);

      // Handle Enter
      if (code === 13) {
        term.write("\r\n");
        const command = currentLineRef.current.trim();

        if (command) {
          commandHistoryRef.current.push(command);
          executeCommand(term, command);
        }

        currentLineRef.current = "";
        historyIndexRef.current = -1;
        term.write(PROMPT);
      }
      // Handle Backspace
      else if (code === 127) {
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(
            0,
            -1,
          );
          term.write("\b \b");
        }
      }
      // Handle Arrow Up
      else if (data === "\x1b[A") {
        if (commandHistoryRef.current.length > 0) {
          // Clear current line
          term.write(
            "\r" +
              PROMPT +
              " ".repeat(currentLineRef.current.length),
          );
          term.write("\r" + PROMPT);

          const newIndex =
            historyIndexRef.current === -1
              ? commandHistoryRef.current.length - 1
              : Math.max(0, historyIndexRef.current - 1);

          historyIndexRef.current = newIndex;
          currentLineRef.current =
            commandHistoryRef.current[newIndex];
          term.write(currentLineRef.current);
        }
      }
      // Handle Arrow Down
      else if (data === "\x1b[B") {
        if (historyIndexRef.current !== -1) {
          // Clear current line
          term.write(
            "\r" +
              PROMPT +
              " ".repeat(currentLineRef.current.length),
          );
          term.write("\r" + PROMPT);

          const newIndex = historyIndexRef.current + 1;

          if (newIndex >= commandHistoryRef.current.length) {
            historyIndexRef.current = -1;
            currentLineRef.current = "";
          } else {
            historyIndexRef.current = newIndex;
            currentLineRef.current =
              commandHistoryRef.current[newIndex];
            term.write(currentLineRef.current);
          }
        }
      }
      // Handle Ctrl+C
      else if (code === 3) {
        term.write("^C\r\n");
        currentLineRef.current = "";
        historyIndexRef.current = -1;
        term.write(PROMPT);
      }
      // Handle Ctrl+L (clear)
      else if (code === 12) {
        term.clear();
        term.write(PROMPT);
      }
      // Regular character input
      else if (code >= 32 && code < 127) {
        currentLineRef.current += data;
        term.write(data);
      }
    });

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
    };
  }, []);

  const executeCommand = async (term: XTerm, cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    switch (trimmedCmd) {
      case "login":
        const res = await axios.post('/api/auth/login', {
          user_id: 'test_user',
          user_pw: 'adminroot!!'
        })
        alert(res.data.message)
        break;

      case "help":
        term.write("\x1b[92mAvailable commands:\x1b[0m\r\n\r\n");
        term.write("\x1b[92m  help      - Show this help message\x1b[0m\r\n");
        term.write("\x1b[92m  about     - About ROOT club\x1b[0m\r\n");
        term.write("\x1b[92m  members   - Show club members\x1b[0m\r\n");
        term.write("\x1b[92m  projects  - View club projects\x1b[0m\r\n");
        term.write("\x1b[92m  contact   - Contact information\x1b[0m\r\n");
        term.write("\x1b[92m  clear     - Clear the terminal\x1b[0m\r\n");
        term.write("\x1b[92m  date      - Show current date\x1b[0m\r\n");
        term.write(
          "\x1b[92m  echo      - Echo a message (usage: echo <message>)\x1b[0m\r\n",
        );
        term.write("\r\n");
        break;

      case "about":
        term.write("\x1b[92mROOT - Hacking Security Club\x1b[0m\r\n\r\n");
        term.write(
          "\x1b[92mROOT는 해킹과 보안을 연구하는 동아리입니다.\x1b[0m\r\n",
        );
        term.write(
          "\x1b[92m우리는 시스템 보안, 웹 해킹, 암호학 등을\x1b[0m\r\n",
        );
        term.write("\x1b[92m다양하게 학습하고 연구합니다.\x1b[0m\r\n\r\n");
        break;

      case "members":
        term.write("\x1b[92mROOT Club Members:\x1b[0m\r\n\r\n");
        term.write("\x1b[92m  \x1b[33m[ADMIN]\x1b[92m root@system\x1b[0m\r\n");
        term.write(
          "\x1b[92m  \x1b[36m[USER]\x1b[92m  member1@system\x1b[0m\r\n",
        );
        term.write(
          "\x1b[92m  \x1b[36m[USER]\x1b[92m  member2@system\x1b[0m\r\n",
        );
        term.write(
          "\x1b[92m  \x1b[36m[USER]\x1b[92m  member3@system\x1b[0m\r\n",
        );
        term.write("\r\n");
        break;

      case "projects":
        term.write("\x1b[92mCurrent Projects:\x1b[0m\r\n\r\n");
        term.write("\x1b[92m  1. CTF Challenge Platform\x1b[0m\r\n");
        term.write("\x1b[92m  2. Vulnerability Scanner\x1b[0m\r\n");
        term.write("\x1b[92m  3. Cryptography Tools\x1b[0m\r\n");
        term.write(
          "\x1b[92m  4. Penetration Testing Framework\x1b[0m\r\n\r\n",
        );
        break;

      case "contact":
        term.write("\x1b[92mContact Information:\x1b[0m\r\n\r\n");
        term.write("\x1b[92m  Email: root@security-club.com\x1b[0m\r\n");
        term.write("\x1b[92m  GitHub: github.com/root-security\x1b[0m\r\n");
        term.write("\x1b[92m  Discord: ROOT Security #1234\x1b[0m\r\n\r\n");
        break;

      case "clear":
        term.clear();
        break;

      case "date":
        term.write("\x1b[92m" + new Date().toString() + "\x1b[0m\r\n\r\n");
        break;

      default:
        if (trimmedCmd.startsWith("echo ")) {
          const message = cmd.substring(5);
          term.write("\x1b[92m" + message + "\x1b[0m\r\n\r\n");
        } else if (trimmedCmd) {
          term.write(
            `\x1b[31mcommand not found: ${trimmedCmd}\x1b[0m\r\n`,
          );
          term.write(
            `\x1b[31mType "help" for available commands\x1b[0m\r\n\r\n${trimmedCmd}`,
          );
        }
    }
  };

  return (
    <div
      className="min-h-screen bg-black"
      style={{ padding: "30px" }}
    >
      <div
        ref={terminalRef}
        className="w-full h-[calc(100vh-60px)]"
      />
    </div>
  );
}