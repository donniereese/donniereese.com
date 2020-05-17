class WebTerm {
    constructor() {
        this._version = '0.0.6';
        // Set variables
        this.visible = false;
        this.path = '/';
        this.prompt = '$';
        // elements
        this.button = null;
        this.termWindow = null;
        this.input = null;
        this.buffer = null;
        this.log = null;
        this.scrollView = null;
        this.currentInput = '';
        this.message = `
HelloTerminal v${this._version}
Status: No Connection...
User: Not Logged In...
_______________________________
Hello, world!
This is a little toy teminal
that I built. You can type
"help" to learn how to use it.
It can help you navigate.
_______________________________\n  \n
`;

        this.history = [];
        this.historyPointer = -1;

        class Dictionary {
            constructor() {
                this._dict = {};
                this._commands = [];
            }

            add(entry) {
                if (!(entry instanceof DictionaryEntry)) throw new Error('You cannot add an entry that is not an instance of DictionaryEntry');
            }

            match() {

            }
        }

        class ArgType {
            constructor(arg = '', types = []) {
                if (arg.length === 0) throw new Error('Must supply argument with a minimum character of 1');
                if (!this.verifyTypesArray) throw new Error('Missformated type located in types for Arguments');

                this._argName = arg;
                this._types = types;
            }

            static verifyTypesArray(types = []) {
                return types.every((val) => typeof val === 'string');
            }
        };

        class Argset {
          constructor() {}

          add() {

          }

          has() {

          }
        }

        class DictionaryEntry {
            constructor(dictionary, data = {}) {
                if (!dictionary) throw new Error('You did something wrong.  No dictionary was provided.');

                const { name, type, matchString, description, arguments } = data;
                const {required, count, types} = arguments;

                if (!required && !count && !types) delete arguments;

                if (arguments) { this.addArguments(arguments);
                    arguments = {};

                    if (required && typeof required === 'boolean') arguments.required = required;
                    if (count && typeof count === 'number') arguments.count = count;

                    if (Array.isArray(types)) {
                        let arr = [];

                        for (let i = 0, c = 0; i < types.length && c === 0; i++) {
                            const it = types[i];
                            if (typeof it !== 'string') {
                                c = 1;
                                arr = [];
                            } else {
                                arr.push(types[i]);
                            }
                        }

                        if (arr.length === 0) types = arr;
                        else delete types;
                    }
                }
            }

            addArgument(arg, types = []) {
                if (!arg) throw new Error('')
            }

            addArguments(argsArray = []) {
                for (let i = 0; i < argsArray.length; i++) {
                  const arg = this.addArgument(argsArray[i]);
                  return false;
                }
            }
        }

        this.dictionary = new Dictionary();
        this.DictionaryEntry = DictionaryEntry;

        // Find button instances by class
        const buttonMatches = document.getElementsByClassName('termButton');
        // return null if none
        if (buttonMatches.length === 0) return null;
        // set the first button
        this.button = buttonMatches.item(0);
        // add the event listener on the button
        this.button.addEventListener('click', this.toggleTerminal.bind(this));
        setTimeout(() => {
            this.button.classList.replace('termButton--hidden', 'termButton--animation');
        }, 2000)
    }

    DictionaryEntry(data = {}) {
      return new this._dictEntry(this.dictionary, data);
    }

    /**
     * Escapes characters in the string that are not safe to use in a RegExp.
     * @param {*} s The string to escape. If not a string, it will be casted
     *      to one.
     * @return {string} A RegExp safe, escaped copy of {@code s}.
     * This is from Google library, so that's really cool.
     */
    regExpEscape(s) {
        // return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
        //     replace(/\x08/g, '\\x08');
        return s;
    };

    clearBuffer() {

    }

    clearTerminal() {
        while (this.log.children.length > 0) {
            this.log.removeChild(this.log.children[0]);
        }
    }

    toggleFullscreen() {
        this.termWindow.classList.toggle('termWindow--fullscreen');
    }

    pageNavigation(args = []) {
        this.writeToBuffer('Not implemented yet.  Be patient!');
    }

    printHelp(args = []) {
        if (args.length <= 0) {
            this.writeToBuffer([
                '',
                'clear',
                '{t}Clears the prompt',
                '',
                'exit',
                '{t}Exits Terminal view and returns to the page',
                '',
                'fullscreen',
                '{t}Toggles fullscreen terminal',
                '',
                'navigate',
                '{t}Access and navigate page sections, anchors, properties, ect.',
                '',
                'scroll [ [-]INT ]',
                '{t}Scrolls the screen by a default of 100px.',
                '{t}OPT: {+/-NUM} Scroll distance',
                '',
                'help',
                '{t}Shows this help menu',
                '',
                'version',
                '{t}Current version of terminal'
            ]);
        } else {
            this.writeToBuffer(args[0]);
        }
    }

    writeToBuffer(argArr = '') {
        if (!Array.isArray(argArr)) argArr = new Array(argArr);
        argArr.forEach((m) => {
            m = m.replace('{t}', ' -- ');
            const newNode = document.createElement('li');
            const newTextNode = document.createTextNode(m);
            newNode.appendChild(newTextNode);
            this.log.appendChild(newNode);
        });
    }

    pushToHistory(m) {
        this.history.push(`${m}`);
    }

    createNewButton() {
        const termButton = document.createElement('div');
        const buttonText = document.createTextNode('>');
        termButton.appendChild(buttonText);
    }

    command(e) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
            if (this.history.length > 0 && this.historyPointer >= 0) {
                this.input.value = this.history[this.historyPointer];
                this.historyPointer = this.historyPointer > 0 ? this.historyPointer - 1 : 0;
            }
        } else if (e.key === 'ArrowDown') {
            if (this.historyPointer >= 0 && this.historyPointer < (this.history.length - 1)) {
                this.historyPointer++;
                this.input.value = this.history[this.historyPointer];
            } if (this.historyPointer === this.history.length - 1) {
                this.input.value = '';
            }
        } else if (e.key === 'Enter') {
            this.currentInput = this.regExpEscape(this.input.value);
            const cmdArr = this.currentInput.split(' ');
            let found = true;
            this.pushToHistory(`${this.currentInput}`);
            this.writeToBuffer(`${this.currentInput}`);
            switch(cmdArr[0]) {
                case 'clear':
                case 'cls':
                    this.clearTerminal();
                    break;
                case 'close':
                case 'quit':
                case 'exit':
                    this.writeToBuffer('Exiting Prompt...');
                    this.deactivateTerminal();
                    break;
                case 'fullscreen':
                    this.toggleFullscreen();
                    break;
                case 'navigate':
                    this.pageNavigation(cmdArr.slice(1));
                    break;
                case 'reload':
                case 'refresh':
                    this.writeToBuffer('Reloading Page...');
                    window.location.reload();
                    break;
                case 'scroll':
                    const dist = parseInt(cmdArr[1]) || 100;
                    window.scrollBy(0,dist);
                    break;
                case 'help':
                    this.printHelp(cmdArr.slice(1));
                    break;
                case 'version':
                    this.writeToBuffer(`Site Prompt Version: ${this._version}`);
                    break;
                case 'ssh':
                case 'telnet':
                case 'ping':
                case 'traceroute':
                case 'mkdir':
                case 'ls':
                    this.writeToBuffer("You've got the wrong idea about me. I'm not that sort of software.");
                default:
                    found = false;
                    this.writeToBuffer(`'${this.currentInput}' is not a valid command.`);
            }

            this.historyPointer = this.history.length - 1;
            this.input.value = '';
            this.scrollView.scrollTop = this.scrollView.scrollHeight;
        }
    }

    activateTerminal() {
        // toggle the activated class name on the button
        // create the terminal window
        this.termWindow = document.createElement('div');
        // create the scrollView
        this.scrollView = document.createElement('div');
        // create the input prompt
        this.input = document.createElement('input');
        // create the console log
        this.log = document.createElement('ul');
        // give scrollView the class
        this.scrollView.classList.add('scrollView');
        // append them to the window element
        this.scrollView.appendChild(this.log);
        this.scrollView.appendChild(this.input);
        // append scrollView to the termWindow
        this.termWindow.appendChild(this.scrollView);
        // Give termWindow it's class
        this.termWindow.classList.add('termWindow');
        // toggle the sticky class on the button
        this.button.classList.toggle('termButton--sticky');
        // Add Event listener onto window
        this.termWindow.addEventListener('click', (e) => {this.input.focus()});
        // Add event listener to scrollView
        this.scrollView.addEventListener('click', (e) => {this.input.focus()});
        // add it to the document
        document.body.appendChild(this.termWindow);
        this.termWindow.appendChild(this.button);
        // Set input event
        this.input.addEventListener('keyup', this.command.bind(this));
        // set focus on input
        this.input.focus();
        // print the message
        this.writeToBuffer(this.message.split('\n'));

        this.visible = true;
    }

    deactivateTerminal() {
        // Move the button to the body node
        document.body.appendChild(this.button);
        // remove the termWindow child
        document.body.removeChild(this.termWindow);
        // Give the button the sticky class
        this.button.classList.toggle('termButton--sticky');
        // set visible flag to false
        this.visible = false;
    }

    toggleTerminal(e) {
        e.preventDefault();
        // if terminal flag is already active, run deactivate
        // else, activate
        if (this.visible) {
            this.deactivateTerminal();
        } else {
            this.activateTerminal();
        }
    }
}

term = new WebTerm();
