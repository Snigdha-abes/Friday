const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

let isListening = false; // Track listening state

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function stopSpeaking() {
    window.speechSynthesis.cancel(); // Stops ongoing speech
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Ma'am...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing FRIDAY..");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false; // Ensures it stops properly

recognition.onstart = () => {
    isListening = true;
    console.log("Listening started...");
};

recognition.onend = () => {
    isListening = false;
    console.log("Listening stopped...");
};

recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    if (!isListening) {
        content.textContent = "Listening....";
        recognition.start();
    } else {
        speak("I'm already listening...");
    }
});

function takeCommand(message) {
    if (message.includes('stop')) {
        stopSpeaking(); // Stops any ongoing speech
        recognition.stop(); //  Stops recognition
        isListening = false; // Ensures it doesn’t restart
        speak("Stopping speech recognition...");
        return;
    }

    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Ma'am, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speak("This is what I found on the internet regarding " + message);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        speak("This is what I found on Wikipedia regarding " + message);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString();
        speak("The time is " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleDateString();
        speak("Today's date is " + date);
    } else if (message.includes('bye')) {
        speak("Goodbye Ma'am, Have a Nice Day");
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        speak("Opening Calculator");
    } else if (message.includes('instagram')) {
        window.open('Instagram:///');
        speak("Opening Instagram");
    } else if(message.includes('whatsapp')) {
        window.open('Whatsapp:///')
        const finalText = "Opening Whatsapp";
        speak(finalText);
    } else {
        // Send query to Gemini API via Backend
        content.textContent = "Thinking...";
        askGemini(message).then(response => {
            content.textContent = response;
            speak(response);
        }).catch(error => {
            console.error("Error fetching response:", error);
            speak("Sorry, I couldn't process that.");
        });
    }
}

// Function to communicate with Gemini API via Backend
async function askGemini(question) {
    try {
        const response = await fetch("http://localhost:3000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        return data.answer;
    } catch (error) {
        console.error("Error:", error);
        return "I'm having trouble connecting to my knowledge base.";
    }
}
