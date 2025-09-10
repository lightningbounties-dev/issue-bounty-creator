const form = document.getElementById('repo-form');
const repoUrlInput = document.getElementById('repo-url');
const analyzeBtn = document.getElementById('analyze-btn');
const loadingDiv = document.getElementById('loading');
const welcomeMessageDiv = document.getElementById('welcome-message');
const issuesContainer = document.getElementById('issues-container');
const errorContainer = document.getElementById('error-container');
const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
const settingsSection = document.getElementById('settings-section');
const userContextInput = document.getElementById('user-context');
const todoToggle = document.getElementById('todo-toggle');

// IMPORTANT: This URL will be the trigger URL of your deployed Cloud Function.
// You will need to replace this placeholder after you deploy it for the first time.
//const CLOUD_FUNCTION_URL = 'YOUR_CLOUD_FUNCTION_TRIGGER_URL_HERE'; 
const CLOUD_FUNCTION_URL = 'https://us-central1-lab-lb-467711.cloudfunctions.net/getAiSuggestions';

toggleSettingsBtn.addEventListener('click', () => {
    settingsSection.classList.toggle('hidden');
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const repoUrl = repoUrlInput.value;
    const userContext = userContextInput.value;
    const scanTodos = todoToggle.checked;
    if (!repoUrl) return;

    // Start loading state
    welcomeMessageDiv.classList.add('hidden');
    issuesContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
    issuesContainer.innerHTML = '';
    errorContainer.innerHTML = '';
    loadingDiv.classList.remove('hidden');
    analyzeBtn.disabled = true;
    analyzeBtn.classList.add('opacity-50', 'cursor-not-allowed');

    try {
        const issues = await getAiSuggestions(repoUrl, userContext, scanTodos);
        displayIssues(repoUrl, issues);
    } catch (error) {
        console.error("Error fetching AI suggestions:", error);
        displayError("Failed to get suggestions. Please check the repository URL and try again. The AI may be unable to access the repository or the content is too large.");
    } finally {
        // End loading state
        loadingDiv.classList.add('hidden');
        analyzeBtn.disabled = false;
        analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
});

async function getAiSuggestions(repoUrl, userContext, scanTodos) {
    
    const payload = {
        repoUrl,
        userContext,
        scanTodos
    };

    const response = await fetch(CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloud Function Error:", errorText);
        throw new Error(`API request failed with status ${response.status}`);
    }

    // The cloud function now returns the JSON directly
    return await response.json();
}

function displayError(message) {
    errorContainer.innerHTML = `<div class="error-message"><p><strong>Error:</strong> ${message}</p></div>`;
    errorContainer.classList.remove('hidden');
}

function getTagColor(tag) {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('priority') || lowerTag.includes('security')) return 'bg-red-100 text-red-800';
    if (lowerTag.includes('refactor') || lowerTag.includes('backend')) return 'bg-blue-100 text-blue-800';
    if (lowerTag.includes('ui/ux') || lowerTag.includes('frontend')) return 'bg-green-100 text-green-800';
    if (lowerTag.includes('testing')) return 'bg-yellow-100 text-yellow-800';
    if (lowerTag.includes('todo')) return 'bg-amber-100 text-amber-800';
    return 'bg-slate-100 text-slate-800';
}

function getIcon(type) {
     if (type === 'vulnerability') {
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                </svg>`;
     }
     if (type === 'feature') {
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-purple-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>`;
     }
    if (type === 'todo') {
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>`;
    }
     return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>`;
}

function displayIssues(repoUrl, issues) {
    // Add a title
    const repoName = new URL(repoUrl).pathname.substring(1);
    const titleHtml = `<h2 class="text-2xl font-bold text-slate-800 mb-5">Suggestions for <span class="text-indigo-600">${repoName}</span></h2>`;
    issuesContainer.innerHTML = titleHtml;

    if (!issues || issues.length === 0) {
         issuesContainer.innerHTML += `<p class="text-slate-500 text-center py-8">The AI couldn't find any specific suggestions for this repository.</p>`;
         issuesContainer.classList.remove('hidden');
         return;
    }

    // Create and append issue cards
    issues.forEach(issue => {
        // Add "TODO" tag if the issue type is 'todo' and it's not already present
        if (issue.type === 'todo' && !issue.tags.some(tag => tag.toLowerCase() === 'todo')) {
            issue.tags.unshift('TODO');
        }
        const tagsHtml = issue.tags.map(tag => `<span class="text-xs font-medium mr-2 px-2.5 py-1 rounded-full ${getTagColor(tag)}">${tag}</span>`).join('');

        // Construct the GitHub issue URL
        const issueTitle = encodeURIComponent(issue.title);
        const issueBody = encodeURIComponent(issue.description);
        const newIssueUrl = `https://github.com/${repoName}/issues/new?title=${issueTitle}&body=${issueBody}`;
        
        // CHANGE THIS: Use marked.parse() to convert Markdown to HTML
        const descriptionHtml = marked.parse(issue.description);

        const card = `
            <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl">
                <div class="p-6">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">${getIcon(issue.type)}</div>
                        <div class="flex-grow">
                            <h3 class="text-lg font-semibold text-slate-900">${issue.title}</h3>
                            <div class="mt-2 mb-4">
                                ${tagsHtml}
                            </div>
                            <!-- CHANGE THIS: Add a 'prose' class for styling -->
                            <div class="prose text-slate-600 text-sm leading-relaxed">${descriptionHtml}</div>
                        </div>
                    </div>
                     <div class="mt-6 flex justify-end">
                        <a href="${newIssueUrl}" target="_blank" rel="noopener noreferrer" class="bg-slate-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                              <path fill-rule="evenodd" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Zm5-2.25a.75.75 0 0 1 .75.75v1.75h1.75a.75.75 0 0 1 0 1.5H7.25v1.75a.75.75 0 0 1-1.5 0V9.75H4a.75.75 0 0 1 0-1.5h1.75V6.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd"></path>
                            </svg>
                            <span>Create GitHub Issue</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        issuesContainer.innerHTML += card;
    });

    issuesContainer.classList.remove('hidden');
}


