// Get references to the DOM elements
const output = document.getElementById('output');
const inputField = document.getElementById('input');
const prompt = document.getElementById('prompt');

// State variables for the OS simulation
let isSystemBricked = false; // Flag to indicate if the system is in an unrecoverable state
let terminalVisible = true;
let stoppedProcesses = [];

// Define available fonts for the terminal output
const availableFonts = [
    { name: 'Default', style: "'JetBrains Mono', monospace" },
    { name: 'Courier New', style: "'Courier New', Courier, monospace" },
    { name: 'Lucida Console', style: "'Lucida Console', Monaco, monospace" },
    { name: 'Ubuntu Mono', style: "'Ubuntu Mono', monospace" },
    { name: 'Hack', style: "'Hack', monospace" },
    { name: 'Consolas', style: "'Consolas', Monaco, 'Andale Mono', 'Ubuntu Mono', monospace" },
    { name: 'Monaco', style: "'Monaco', 'Lucida Console', 'Ubuntu Mono', monospace" },
    { name: 'Source Code Pro', style: "'Source Code Pro', monospace" },
    { name: 'Fira Code', style: "'Fira Code', monospace" },
    { name: 'Inconsolata', style: "'Inconsolata', monospace" }
];

// Add font import links for the new fonts if they are not standard
// Note: 'JetBrains Mono', 'Ubuntu Mono', 'Hack' are already imported in HTML.
// You might need to add links for other fonts if you want to use web fonts.
// Example: <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet">
// Example: <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet">
// Example: <link href="https://fonts.googleapis.com/css2?family=Inconsolata&display=swap" rel="stylesheet">


// Boot sequence messages
const bootSequence = [
    "Initializing OS...",
    "Checking hardware compatibility...",
    "Loading kernel 5.4.1-1059-gcp...",
    "Mounting root filesystem...",
    "Setting up system directories...",
    "Configuring network interfaces...",
    "Loading system modules...",
    "Initializing security protocols...",
    "Checking system integrity...",
    "Updating system components...",
    "Applying security patches...",
    "Starting system services...",
    "Loading user environment...",
];

// Simulate the OS boot sequence with timed messages
function simulateBootSequence() {
    isSystemBricked = false; // IMPORTANT: Reset bricked state at the start of boot
    inputField.disabled = true; // Disable input during boot
    prompt.style.display = 'none'; // Hide prompt during boot
    output.innerHTML = ''; // Clear previous output
    return new Promise((resolve) => {
        bootSequence.forEach((message, index) => {
            setTimeout(() => {
                const progressElement = document.createElement('p');
                progressElement.innerHTML = `<span class="highlight">[${index + 1}/${bootSequence.length}]</span> ${message}`;
                output.appendChild(progressElement);
                output.scrollTop = output.scrollHeight; // Scroll to the bottom as messages appear
                if (index === bootSequence.length - 1) {
                    setTimeout(resolve, 500); // Resolve promise after the last message
                }
            }, 300 * (index + 1)); // Delay each message
        });
    });
}

// Finalize the boot sequence and prepare the terminal for user input
function finalizeBootSequence() {
    output.innerHTML = ''; // Clear boot messages
    // Display initial welcome messages
    output.innerHTML = `
        <p>Welcome to <span class="highlight">OrbitOS</span></p>
        <p>Type 'help' for a list of commands</p>
        <p class="highlight">Security patch: 1 May 2025</p>
    `;
    inputField.disabled = false; // Enable input
    prompt.style.display = 'inline'; // Show prompt
    inputField.focus(); // Focus the input field
    prompt.textContent = `${config.username}@${config.hostname}:~$`; // Set the prompt text
    terminalVisible = true; // Mark terminal as visible
    stoppedProcesses = []; // Reset stopped processes on reboot
}

// Command history for arrow key navigation
let commandHistory = [];
let historyIndex = -1;

// Configuration object for system information and settings
const config = {
    username: 'root',
    hostname: 'orbit',
    version: '3.4',
    lastBootTime: new Date().toLocaleString(),
    systemInfo: {
        os: 'OrbitOS',
        version: '3.4 - beta',
        kernel: '5.4.1-1059-gcp',
        architecture: 'x86_64',
        memory: '4.0GiB',
        disk: '1.0GiB',
        processes: 3,
    },

    batteryInfo: {
        percentage: Math.floor(Math.random() * 100) + 1, // Random initial battery percentage
        charging: Math.random() > 0.5 // Random initial charging status
    },

    weatherInfo: {
        locations: [
            { city: "Tokyo", country: "Japan" },
            { city: "London", country: "UK" },
            { city: "New York", country: "USA" },
            { city: "Sydney", country: "Australia" },
            { city: "Paris", country: "France" },
            { city: "Cairo", country: "Egypt" },
            { city: "Rio de Janeiro", country: "Brazil" },
            { city: "Cape Town", country: "South Africa" },
            { city: "Moscow", country: "Russia" },
            { city: "Singapore", country: "Singapore" },
            { city: "Dubai", country: "UAE" },
            { city: "Berlin", country: "Germany" },
            { city: "Toronto", country: "Canada" },
            { city: "Mumbai", country: "India" },
            { city: "Seoul", country: "South Korea" }
        ],
        conditions: [
            "Clear skies",
            "Partly cloudy",
            "Overcast",
            "Light rain",
            "Heavy rain",
            "Thunderstorm",
            "Foggy",
            "Snowing",
            "Sunny",
            "Windy"
        ],
        precipitationTypes: [
            "None",
            "Drizzle",
            "Rain",
            "Snow",
            "Sleet",
            "Hail"
        ]
    }
};

// Generate a simulated time remaining for the battery
function generateBatteryTimeRemaining(percentage, isCharging) {
    if (isCharging) {
        const remainingPercentage = 100 - percentage;
        const minutesPerPercent = Math.floor(Math.random() * 2) + 1; // Simulate charging speed
        const totalMinutes = remainingPercentage * minutesPerPercent;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (percentage === 100) {
            return "Fully charged";
        } else {
            return `${hours}h ${minutes}m until full`;
        }
    } else {
        const minutesPerPercent = Math.floor(Math.random() * 10) + 5; // Simulate discharging speed
        const totalMinutes = percentage * minutesPerPercent;

        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes = totalMinutes % 60;

        if (days > 0) {
            return `${days}d ${hours}h remaining`;
        } else {
            return `${hours}h ${minutes}m remaining`;
        }
    }
}

// Store current weather data to avoid regenerating on every command
let currentWeatherData = null;

// Generate random weather information
function generateRandomWeather() {
    // Return cached data if available
    if (currentWeatherData) {
        return currentWeatherData;
    }

    // Select a random location
    const locationIndex = Math.floor(Math.random() * config.weatherInfo.locations.length);
    const location = config.weatherInfo.locations[locationIndex];

    // Generate random temperature
    const temperature = Math.floor(Math.random() * 51) - 10; // Between -10 and 40

    // Select a random condition
    const conditionIndex = Math.floor(Math.random() * config.weatherInfo.conditions.length);
    const condition = config.weatherInfo.conditions[conditionIndex];

    // Generate random humidity
    const humidity = Math.floor(Math.random() * 76) + 20; // Between 20 and 95

    // Generate random wind speed
    const windSpeed = Math.floor(Math.random() * 51); // Between 0 and 50

    // Select a random precipitation type
    const precipIndex = Math.floor(Math.random() * config.weatherInfo.precipitationTypes.length);
    const precipitation = config.weatherInfo.precipitationTypes[precipIndex];

    // Generate random chance of precipitation
    const precipChance = Math.floor(Math.random() * 101); // Between 0 and 100

    // Store and return the generated data
    currentWeatherData = {
        location,
        temperature,
        condition,
        humidity,
        windSpeed,
        precipitation,
        precipChance
    };

    return currentWeatherData;
}

// Predefined content for terminal "websites"
const terminalSites = {
    'notavirus.zip': `
        <p class="highlight">--- notavirus.zip ---</p>
        <p>Contents seem... suspicious. Handle with care.</p>
        <p>  - totally_safe.exe</p>
        <p>  - free_money.txt</p>
        <p>  - instructions.rtf</p>
        <p class="highlight">Use 'run [filename]' to execute.</p>
    `,
    'news.orb': `
        <p><span class="highlight">OrbitOS News Feed</span></p>
        <p>-------------------</p>
        <p>- OrbitOS version 3.3.2 is here.</p>
        <p>- added fortune and cowsay!.</p>

        `,
    'about.os': `
        <p><span class="highlight">About OrbitOS</span></p>
        <p>Version: ${config.systemInfo.version}</p>
        <p>Kernel: ${config.systemInfo.kernel}</p>
        <p>A lightweight, terminal-focused operating system simulation.</p>
        <p>Developed for fun and learning.</p>
    `
};

// List of files that trigger the system brick
const maliciousFiles = ['totally_safe.exe', 'free_money.txt', 'instructions.rtf'];

// Generate chaotic output for the bricked state
function generateChaoticOutput() {
    let text = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    for (let i = 0; i < 50; i++) { // 50 lines
        for (let j = 0; j < 80; j++) { // 80 characters per line
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        text += '\n'; // Newline after each line
    }
    return `<pre class="error">${text}</pre>`; // Use <pre> for preformatted text
}

// Trigger the system brick state
function triggerSystemBrick() {
    isSystemBricked = true;
    inputField.disabled = true;
    prompt.style.display = 'none';

    const brickMessage = document.createElement('p');
    brickMessage.innerHTML = `<span class="highlight error">[!!! KERNEL PANIC !!!]</span><br>System integrity compromised. Unrecoverable error.<br>Corrupted sector: 0xDEADBEEF<br>Unable to load core modules.<br>System halted. Please reboot the system.`;
    brickMessage.style.color = '#ff6b6b'; // Error color
    brickMessage.style.fontWeight = 'bold';
    output.appendChild(brickMessage);
    scrollToBottom();
}

// Toggle the visibility of the terminal
function toggleTerminal(visible) {
    const terminal = document.querySelector('.terminal');
    if (terminal) {
        if (visible) {
            terminal.style.display = 'block';
            terminalVisible = true;
            inputField.focus(); // Focus input when visible
        } else {
            terminal.style.display = 'none';
            terminalVisible = false;
        }
    }
}

// Halt the system manually
function systemHalt() {
    isSystemBricked = true;
    inputField.disabled = true;
    prompt.style.display = 'none';

    const haltMessage = document.createElement('p');
    haltMessage.innerHTML = `<span class="highlight error">[SYSTEM HALTED]</span><br>System has been manually halted.<br>Critical process stopped.<br>System unable to continue operation.<br>Please reboot to restore functionality.`;
    haltMessage.style.color = '#ff6b6b'; // Error color
    haltMessage.style.fontWeight = 'bold';
    output.appendChild(haltMessage);
    scrollToBottom();
}

// Function to apply the selected font style to the output area
function applyFont(fontStyle) {
    output.style.fontFamily = fontStyle;
}

// Object containing all available commands and their functions
const commands = {
    help: () => `
        <p><span class="highlight">Available Commands:</span></p>
        <p>help           - Shows this help message</p>
        <p>clear          - Clears the terminal screen</p>
        <p>echo [text]    - Prints the specified text</p>
        <p>ls             - Lists files in current directory</p>
        <p>run [filename] - Executes a specified file (if runnable)</p>
        <p>date           - Shows current date and time</p>
        <p>neofetch       - Displays system information</p>
        <p>whoami         - Shows current user</p>
        <p>history        - Shows command history</p>
        <p>battery        - Shows battery status</p>
        <p>software       - Shows system changelog</p>
        <p>weather        - Shows weather information</p>
        <p>processes      - Lists running processes</p>
        <p>calc [expr]    - Calculate mathematical expression</p>
        <p>browser [site] - Access predefined terminal websites</p>
        <p>stop [process] - Stop a process or component</p>
        <p>fortune        - Get a random fortune message</p>
        <p>cowsay [text]  - Display a cow saying your message</p>
        <p>shutdown       - Shutsdown OrbitOS</p>
        <p>reboot         - Reboots OrbitOS</p>
        <p>font  - Selects terminal font</p>
    `,

    clear: () => {
        output.innerHTML = ''; // Clear the output div
        return ''; // No output message needed after clearing
    },

    echo: (args) => args ? `<p>${args}</p>` : '<p>Nothing to echo.</p>', // Echo the provided arguments

    ls: () => `
        <p class="highlight">Current directory contents:</p>
        <p>📁 Documents/</p>
        <p>📁 Downloads/</p>
        <p>📁 Pictures/</p>
        <p>📄 system.log</p>
        <p>📄 readme.md</p>
        <p>📄 notavirus.zip (Use browser to view contents)</p>
    `,

    run: (args) => {
        const filename = args.trim();
        if (!filename) {
            return '<p>Usage: run [filename]</p>';
        }

        if (maliciousFiles.includes(filename)) {
            setTimeout(triggerSystemBrick, 1500); // Trigger brick after a delay
            return generateChaoticOutput() + `<p class="highlight">Executing ${filename}...</p>`;
        } else {
            return `<p>Error: File '${filename}' not found or cannot be executed.</p>`;
        }
    },

    stop: (args) => {
        const processName = args.trim().toLowerCase();

        if (!processName) {
            return '<p>Usage: stop [process]</p><p>Available processes: terminal, system, browser, process</p>';
        }

        if (processName === 'terminal') {
            toggleTerminal(false); // Hide the terminal
            return '<p class="highlight">Terminal interface stopped. Refresh page to restore.</p>';
        }
        else if (processName === 'system') {
            setTimeout(systemHalt, 500); // Halt system after a delay
            return '<p class="highlight">WARNING: Critical system process stopping...</p>';
        }
        else if (processName === 'browser') {
            if (stoppedProcesses.includes('browser')) {
                return '<p class="error">Browser process already stopped.</p>';
            }
            stoppedProcesses.push('browser'); // Add browser to stopped processes
            return '<p>Browser process stopped. "browser" command is now disabled.</p>';
        }
        else if (processName === 'process') {
            const pid = Math.floor(Math.random() * 1000) + 1; // Simulate stopping a random process
            return `<p>Process with PID ${pid} stopped successfully.</p>`;
        }
        else {
            return `<p class="error">Error: Process '${processName}' not found or cannot be stopped.</p>`;
        }
    },

    date: () => `<p>${new Date().toLocaleString()}</p>`, // Display current date and time

    neofetch: () => `
        <pre class="highlight">
          /\\
         /  \\
        /    \\
       /      \\
      /   ◢◤   \\
     /    ||    \\
    /     ||     \\
   /      ||      \\
  /________________\\
        </pre>
        <p><span class="highlight">${config.systemInfo.os}</span>@${config.username}</p>
        <p>-----------------</p>
        <p>OS: ${config.systemInfo.os} ${config.systemInfo.version}</p>
        <p>Kernel: ${config.systemInfo.kernel}</p>
        <p>Architecture: ${config.systemInfo.architecture}</p>
        <p>Memory: ${config.systemInfo.memory}</p>
        <p>Disk: ${config.systemInfo.disk}</p>
        <p>Uptime: ${getUptime()}</p>
    `,

    whoami: () => `<p class="highlight">${config.username}@${config.hostname}</p>`, // Display current user and hostname

    history: () => commandHistory.map((cmd, i) => `<p>${i + 1}. ${cmd}</p>`).join('') || '<p>No command history yet.</p>', // Display command history

    battery: () => {
        const percentage = config.batteryInfo.percentage;
        const isCharging = config.batteryInfo.charging;
        const timeRemaining = generateBatteryTimeRemaining(percentage, isCharging);

        return `
            <p>Battery Status:</p>
            <p>Charge: ${percentage}%</p>
            <p>Status: ${isCharging ? 'Charging' : 'Discharging'}</p>
            <p>Time ${isCharging ? 'to full' : 'remaining'}: ${timeRemaining}</p>
        `;
    },

    software: () => `
        <p class="highlight">OrbitOS ${config.version} Changelog:</p>
        <p>Orbit OS 3.4 upgrade.</p>


        <p>✅ Added 10 fonts.</p>
        </p>⚙ improved UI
        <p>⛔ System improvements.</p>
    `,

    weather: () => {
        const weather = generateRandomWeather();
        const { location, temperature, condition, humidity, windSpeed, precipitation, precipChance } = weather;

        return `
            <p class="highlight">Current Weather:</p>
            <p>Location: ${location.city}, ${location.country}</p>
            <p>Temperature: ${temperature}°C</p>
            <p>Condition: ${condition}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} km/h</p>
            <p>Precipitation: ${precipitation} (${precipChance}% chance)</p>
        `;
    },

    processes: () => `
        <p class="highlight">Running Processes:</p>
        <p>1. system_core    (PID: 1)</p>
        <p>2. terminal       (PID: 245)</p>
        <p>3. user_session   (PID: 892)</p>
        ${stoppedProcesses.length > 0 ? '<p class="highlight">Stopped Processes:</p>' +
          stoppedProcesses.map(proc => `<p>- ${proc}</p>`).join('') : ''}
    `,

    shutdown: () => {
        const response = '<p>Shutting down...</p>';
        isSystemBricked = true; // Mark system as bricked to prevent further input
        inputField.disabled = true;
        prompt.style.display = 'none';
        setTimeout(() => {
            // Replace body content with a simple message after a delay
            document.body.innerHTML = '<p style="color: #ccc; font-family: monospace; text-align: center; margin-top: 50px;">System halted.</p>';
        }, 1000);
        return response;
    },

    reboot: async () => {
        output.innerHTML = '<p>Rebooting system...</p>';
        inputField.disabled = true;
        prompt.style.display = 'none';

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate reboot delay
        await simulateBootSequence(); // Run the boot sequence - this resets isSystemBricked
        finalizeBootSequence(); // Finalize after boot - this re-enables input
        return ''; // No immediate output
    },

    calc: (args) => {
        try {
            if (!args) return "<p>Usage: calc [expression]</p>";
            // Basic sanitization to prevent arbitrary code execution
            const safeArgs = args.replace(/[^-()\d/*+.]/g, '');
            if (!safeArgs) return `<p>Error: Invalid characters in expression</p>`;
            // Use new Function for safe evaluation of mathematical expressions
            const result = new Function(`return ${safeArgs}`)();
            return `<p>Result: ${result}</p>`;
        } catch (error) {
            console.error("Calc Error:", error);
            return `<p>Error: Invalid expression or calculation failed</p>`;
        }
    },

    browser: (args) => {
        if (stoppedProcesses.includes('browser')) {
            return '<p class="error">Browser process is stopped. Use "reboot" to restore functionality.</p>';
        }

        const siteName = args.trim();
        if (!siteName) {
             const availableSites = Object.keys(terminalSites).join(', ');
            return `<p>Usage: browser [site_name]</p><p>Available sites: ${availableSites || 'None'}</p>`;
        }

        const siteContent = terminalSites[siteName];

        if (siteContent) {
            let browserOutput = `<p>Connecting to ${siteName}...</p>`;
            browserOutput += `<p>Loading content...</p>`;
            browserOutput += siteContent;
            return browserOutput;
        } else {
            return `<p class="error">Error 404: Site '${siteName}' not found in terminal network.</p>`;
        }
    },

    fortune: () => {
        const fortunes = [
            "You will find a hidden treasure where you least expect it.",
            "A beautiful, smart, and loving person will be coming into your life.",
            "Your hard work is about to pay off. Remember, Rome wasn't built in a day.",
            "A dubious friend may be an enemy in camouflage.",
            "A faithful friend is a strong defense.",
            "A fresh start will put you on your way.",
            "A person of words and not deeds is like a garden full of weeds.",
            "All the effort you are making will ultimately pay off.",
            "An inch of time is an inch of gold.",
            "Any day above ground is a good day.",
            "Change is happening in your life, so go with the flow!",
            "Competence like yours is underrated.",
            "Curiosity kills boredom. Nothing kills curiosity.",
            "Dedicate yourself with a calm mind to the task at hand.",
            "Don't just spend time, invest it.",
            "Every wise man started out by asking many questions.",
            "Failure is the path of least persistence.",
            "Fear and desire – two sides of the same coin.",
            "Go take a rest; you deserve it.",
            "He who expects no gratitude shall never be disappointed.",
            "It is better to deal with problems before they arise.",
            "It's amazing how much good you can do if you don't care who gets the credit.",
            "Miles are covered one step at a time.",
            "The greatest risk is not taking one.",
            "The person who will not stand for something will fall for anything.",
            "There is no greater pleasure than seeing your loved ones prosper.",
            "You are far more influential than you think.",
            "Your ability to juggle many tasks will take you far.",
            "Your hard work will soon be rewarded."
        ];

        const randomIndex = Math.floor(Math.random() * fortunes.length);
        return `<p class="highlight">Fortune says:</p><p>${fortunes[randomIndex]}</p>`;
    },

    cowsay: (args) => {
        const message = args.trim() || "Moo!";

        // Create the speech bubble
        const bubbleWidth = message.length + 2;
        const topLine = ` ${'_'.repeat(bubbleWidth)} `;
        const bottomLine = ` ${'-'.repeat(bubbleWidth)} `;
        const textLine = `< ${message} >`;

        // Create the cow ASCII art
        const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
    `;

        return `<pre>${topLine}
${textLine}
${bottomLine}${cow}</pre>`;
    },

    // New 'font' command
    font: (args) => {
        const fontIndex = parseInt(args.trim());

        // If no argument or invalid number, list the fonts
        if (isNaN(fontIndex) || fontIndex < 1 || fontIndex > availableFonts.length) {
            let fontList = '<p class="highlight">Available Fonts:</p>';
            availableFonts.forEach((font, index) => {
                fontList += `<p>${index + 1}. ${font.name}</p>`;
            });
            fontList += `<p>Usage: font [number]</p>`;
            return fontList;
        } else {
            // Apply the selected font
            const selectedFont = availableFonts[fontIndex - 1];
            applyFont(selectedFont.style);
            return `<p>Font changed to: <span class="highlight">${selectedFont.name}</span></p>`;
        }
    }
};

// Calculate the uptime of the system
function getUptime() {
    const now = new Date();
    const boot = new Date(config.lastBootTime);
    const diff = now - boot; // Difference in milliseconds

    if (isNaN(diff) || diff < 0) {
        return 'Calculating...'; // Handle potential errors
    }

    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours %= 24; // Remaining hours after calculating days
    minutes %= 60; // Remaining minutes after calculating hours
    seconds %= 60; // Remaining seconds after calculating minutes

    let uptimeString = '';
    if (days > 0) uptimeString += `${days} day(s) `;
    if (hours > 0) uptimeString += `${hours} hour(s) `;
    if (minutes > 0) uptimeString += `${minutes} minute(s) `;
    // Optionally add seconds if needed, but minutes is usually sufficient for uptime

    return uptimeString.trim() || 'Just booted'; // Return the formatted string or 'Just booted'
}


// Execute the command entered by the user
function executeCommand(input) {
     if (isSystemBricked) {
        return '<p style="color: #ff6b6b;">System unresponsive.</p>'; // Prevent commands if bricked
    }

    const trimmedInput = input.trim();
    if (!trimmedInput) {
        return ''; // Do nothing if input is empty
    }

    const [command, ...args] = trimmedInput.split(' '); // Split command and arguments
    const lowerCaseCommand = command.toLowerCase(); // Case-insensitive command matching
    const commandFunction = commands[lowerCaseCommand]; // Get the command function

     let outputResult;
    if (typeof commandFunction === 'function') {
        outputResult = commandFunction(args.join(' ')); // Execute the command function
    } else {
         outputResult = `<p>Command not found: ${command}. Type 'help' for available commands.</p>`; // Handle unknown commands
    }

    // Add command to history, avoiding duplicates if the last command was the same
    if (trimmedInput) {
       if (commandHistory[commandHistory.length - 1] !== trimmedInput) {
           commandHistory.push(trimmedInput);
       }
       historyIndex = commandHistory.length; // Reset history index to the end
    }

    return outputResult; // Return the output generated by the command
}

// Display the user's command and the system's response in the output area
function displayResponse(input) {
    const commandDiv = document.createElement('div');
    const promptSpan = document.createElement('span');
    promptSpan.className = 'highlight';
    promptSpan.textContent = prompt.textContent;
    const commandText = document.createTextNode(` ${input}`);

    const commandPara = document.createElement('p');
    commandPara.appendChild(promptSpan);
    commandPara.appendChild(commandText);
    commandDiv.appendChild(commandPara);

    output.appendChild(commandDiv); // Add the command line to the output

    const response = executeCommand(input); // Execute the command and get the response

    if (response) {
        const responseDiv = document.createElement('div');
        responseDiv.innerHTML = response;

        // Add error class for specific messages
        if (response.includes('Error') || response.includes('not found') || response.includes('KERNEL PANIC') || response.includes('SYSTEM HALTED')) {
           responseDiv.classList.add('error-message');
        }
        output.appendChild(responseDiv); // Add the response to the output
    }

    scrollToBottom(); // Scroll to the latest output
    inputField.value = ''; // Clear the input field
}

// Scroll the output area to the bottom
function scrollToBottom() {
    setTimeout(() => {
         output.scrollTop = output.scrollHeight;
    }, 0); // Use a small timeout to ensure content is rendered before scrolling
}

// Event listener for when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', async () => {
    // Initialize random battery and weather data on load
    config.batteryInfo.percentage = Math.floor(Math.random() * 100) + 1;
    config.batteryInfo.charging = Math.random() > 0.5;
    generateRandomWeather();

    await simulateBootSequence(); // Run the boot sequence
    finalizeBootSequence(); // Finalize after boot
});

// Event listener for keydown events on the input field
inputField.addEventListener('keydown', function (event) {
    // If the system is bricked, prevent any input
    if (isSystemBricked) {
        event.preventDefault();
        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        const input = inputField.value.trim();
        if (input) {
            displayResponse(input); // Display response for non-empty input
        } else {
            // Display just the prompt line for empty input
            const commandDiv = document.createElement('div');
            commandDiv.innerHTML = `<p><span class="highlight">${prompt.textContent}</span> </p>`;
            output.appendChild(commandDiv);
            scrollToBottom();
        }
        inputField.value = ''; // Clear input after command
        historyIndex = commandHistory.length; // Reset history index
    } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent cursor movement
        if (commandHistory.length > 0) {
            if (historyIndex > 0) {
                historyIndex--; // Move up in history
            }
            inputField.value = commandHistory[historyIndex]; // Set input to history command
            // Keep cursor at the end of the input
            inputField.setSelectionRange(inputField.value.length, inputField.value.length);
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent cursor movement
        if (commandHistory.length > 0) {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++; // Move down in history
                inputField.value = commandHistory[historyIndex]; // Set input to history command
                // Keep cursor at the end of the input
                inputField.setSelectionRange(inputField.value.length, inputField.value.length);
            } else {
                historyIndex = commandHistory.length; // Go past the last command (empty input)
                inputField.value = ''; // Clear input
            }
        }
    }
});

// Focus the input field when clicking anywhere in the terminal area
document.querySelector('.terminal').addEventListener('click', (e) => {
    // Only focus the input if the system is not bricked and the click wasn't on the input itself
    if (!isSystemBricked && e.target !== inputField) {
      inputField.focus();
    }
})

