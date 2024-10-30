let tokenClient;
let gapiInited = false;
let gisInited = false;

// Load GAPI client library
function gapiLoad() {
    gapi.load('client', gapiInit);
}

// Initialize GAPI client
function gapiInit() {
    gapi.client.init({}).then(function() {
        gapi.client.load('https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest')
            .then(() => {
                gapiInited = true;
                checkBeforeStart();
            });
    });
}

// Load Google Identity Services (GIS) client library
function gsiLoad() {
    gisInit();
}

// Initialize GIS client
function gisInit() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '707809225486-qs8elc8gokrbgrr2r50dtqf6kv6litjj.apps.googleusercontent.com',  // Replace with your client ID
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
        callback: '',  // Defined at request time
    });
    gisInited = true;
    checkBeforeStart();
}

// Check if both clients are initialized
function checkBeforeStart() {
    if (gapiInited && gisInited) {
        document.getElementById("showEmailsBtn").style.visibility = "visible";
    }
}

// Show Emails function
function showEmails() {
    if (!tokenClient) {
        console.error("tokenClient is not defined.");
        return;
    }

    tokenClient.callback = (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        console.log('Access token: ' + JSON.stringify(gapi.client.getToken()));

        // Fetch the top 100 emails from the inbox
        gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'labelIds': ['INBOX'],
            'maxResults': 100
        }).then(response => {
            const messages = response.result.messages;
            if (!messages || messages.length === 0) {
                document.getElementById("email-summary").innerHTML = "No emails found in the inbox.";
                return;
            }

            // Fetch and summarize each email
            let emailContainer = document.getElementById("email-container");
            emailContainer.innerHTML = "";  // Clear previous content
            messages.forEach((message) => {
                gapi.client.gmail.users.messages.get({
                    'userId': 'me',
                    'id': message.id
                }).then(emailResponse => {
                    const email = emailResponse.result;
                    const subjectHeader = email.payload.headers.find(header => header.name === "Subject");
                    const fromHeader = email.payload.headers.find(header => header.name === "From");
                    const subject = subjectHeader ? subjectHeader.value : "No Subject";
                    const from = fromHeader ? fromHeader.value : "Unknown Sender";

                    // Create block format for emails
                    const emailBox = document.createElement('div'); // Create the email box
                    emailBox.innerHTML = `<h3>${subject}</h3><p>From: ${from}</p>`;
                    emailBox.onclick = function() {
                        showEmailSummary(emailBox, message.id);
                    };

                    emailContainer.appendChild(emailBox);
                });
            });

            document.getElementById("email-summary").style.display = "block";
        });
    };

    // Request access token
    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

function showEmailSummary(emailBox, messageId) {
    gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': messageId
    }).then(emailResponse => {
        const snippet = emailResponse.result.snippet;
        const parts = emailResponse.result.payload.parts || [];
        let attachments = [];

        // Look for attachments in the email parts
        parts.forEach(part => {
            if (part.filename && part.body.attachmentId) {
                attachments.push({
                    filename: part.filename,
                    attachmentId: part.body.attachmentId,
                    mimeType: part.mimeType
                });
            }
        });

        // Create a summary element if it doesn't exist
        let summaryDiv = emailBox.querySelector('.email-summary');
        if (!summaryDiv) {
            summaryDiv = document.createElement('div');
            summaryDiv.className = 'email-summary';
            emailBox.appendChild(summaryDiv);
        }

        // Toggle the visibility of the summary
        if (summaryDiv.style.display === 'block') {
            summaryDiv.style.display = 'none';
        } else {
            summaryDiv.style.display = 'block';
            summaryDiv.innerHTML = `<p>${snippet}</p>`;

            // If there are attachments, add them to the summary
            if (attachments.length > 0) {
                let attachmentsDiv = document.createElement('div');
                attachmentsDiv.className = 'attachments';

                let attachmentHeader = document.createElement('h4');
                attachmentHeader.textContent = 'Attachments:';
                attachmentsDiv.appendChild(attachmentHeader);

                attachments.forEach(attachment => {
                    let attachmentLink = document.createElement('a');
                    attachmentLink.href = '#';
                    attachmentLink.textContent = attachment.filename;
                    attachmentLink.onclick = function (e) {
                        e.preventDefault();
                        downloadAttachment(messageId, attachment.attachmentId, attachment.filename);
                    };

                    attachmentsDiv.appendChild(attachmentLink);
                    attachmentsDiv.appendChild(document.createElement('br'));
                });

                summaryDiv.appendChild(attachmentsDiv);
            }
        }
    });
}

// Function to download an attachment
function downloadAttachment(messageId, attachmentId, filename) {
    gapi.client.gmail.users.messages.attachments.get({
        'userId': 'me',
        'messageId': messageId,
        'id': attachmentId
    }).then(attachmentResponse => {
        const attachmentData = attachmentResponse.result.data;
        const base64Data = atob(attachmentData.replace(/-/g, '+').replace(/_/g, '/'));
        const byteArray = new Uint8Array(base64Data.length);

        for (let i = 0; i < base64Data.length; i++) {
            byteArray[i] = base64Data.charCodeAt(i);
        }

        // Create a Blob and generate a downloadable URL
        const blob = new Blob([byteArray], { type: attachmentResponse.mimeType });
        const downloadUrl = URL.createObjectURL(blob);

        // Trigger the download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.click();

        // Revoke the object URL after download
        URL.revokeObjectURL(downloadUrl);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");

    let userMessage = null; // Variable to store user's message
    const inputInitHeight = chatInput.scrollHeight;

    // API configuration
    const somethingthatyouthinkthatitnotbutitis = "AIzaSyBqdOlaL21qWByQIdDlFBcvNRWos2Pl-CA"; // Your API key here
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${somethingthatyouthinkthatitnotbutitis}`;

    const createChatLi = (message, className) => {
        // Create a chat <li> element with passed message and className
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi; // return chat <li> element
    }

    const generateResponse = async (chatElement) => {
        const messageElement = chatElement.querySelector("p");

        // Define the properties and message for the API request
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                contents: [{ 
                    role: "user", 
                    parts: [{ text: userMessage }] 
                }] 
            }),
        }

        // Send POST request to API, get response and set the response as paragraph text
        try {
            const response = await fetch(API_URL, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message);
            
            // Get the API response text and update the message element
            messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        } catch (error) {
            // Handle error
            messageElement.classList.add("error");
            messageElement.textContent = error.message;
        } finally {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    }

    const handleChat = () => {
        userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
        if (!userMessage) return;

        // Clear the input textarea and set its height to default
        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;

        // Create chat list item for outgoing message
        const outgoingChatLi = createChatLi(userMessage, "outgoing");
        chatbox.appendChild(outgoingChatLi);

        // Scroll chatbox to show the latest message
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Generate a response and create chat list item for it
        generateResponse(outgoingChatLi);
    }

    chatInput.addEventListener("input", () => {
        if (chatInput) {
            chatInput.style.height = `${inputInitHeight}px`;
            chatInput.style.height = `${chatInput.scrollHeight}px`;
        }
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
        }
    });

    sendChatBtn.addEventListener("click", handleChat);
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

    // Load the necessary APIs
    gsiLoad();
    gapiLoad();
});
