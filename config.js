const CONFIG = {
    // Email Settings
    EMAIL_SETTINGS: {
        maxResults: 50,
        autoRefreshInterval: 300000, // 5 minutes
        workDomains: ['company.com', 'work.', 'office.', 'corporate.'],
        socialDomains: ['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com'],
        defaultSignature: '',
        draftAutoSaveInterval: 60000 // 1 minute
    },
    
    // UI Settings
    UI_SETTINGS: {
        toastDuration: 3000,
        animationDuration: 300,
        darkModeClass: 'dark-mode',
        gridViewClass: 'grid-view',
        listViewClass: 'list-view',
        maxAttachmentSize: 25 * 1024 * 1024, // 25MB
        maxAttachments: 10,
        animations: {
            duration: 300,
            timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        },
        themes: {
            light: {
                primary: '#4f46e5',
                secondary: '#818cf8',
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                background: '#ffffff',
                surface: '#f3f4f6',
                text: '#1f2937',
                muted: '#6b7280'
            },
            dark: {
                primary: '#818cf8',
                secondary: '#4f46e5',
                success: '#34d399',
                warning: '#fbbf24',
                danger: '#f87171',
                background: '#1f2937',
                surface: '#374151',
                text: '#f3f4f6',
                muted: '#9ca3af'
            }
        }
    },
    
    // Analytics Settings
    ANALYTICS_SETTINGS: {
        chartColors: {
            primary: '#4f46e5',
            secondary: '#818cf8',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444'
        },
        periods: {
            day: '24h',
            week: '7d',
            month: '30d',
            year: '365d'
        }
    },
    
    // AI Assistant Settings
    AI_SETTINGS: {
        minConfidenceScore: 0.7,
        maxSuggestions: 5,
        smartReplyEnabled: true,
        sentimentAnalysisEnabled: true,
        keywordExtractionEnabled: true
    },
    
    // Search Settings
    SEARCH_SETTINGS: {
        minQueryLength: 2,
        maxResults: 100,
        debounceTime: 300,
        searchOperators: ['from:', 'to:', 'subject:', 'has:'],
        stopWords: ['the', 'is', 'at', 'which', 'on']
    },
    
    // Keyboard Shortcuts
    KEYBOARD_SHORTCUTS: {
        compose: 'c',
        reply: 'r',
        replyAll: 'a',
        forward: 'f',
        archive: 'e',
        delete: '#',
        nextEmail: 'j',
        previousEmail: 'k',
        toggleStar: 's',
        help: '?'
    },
    
    // Voice Command Settings
    VOICE_SETTINGS: {
        language: 'en-US',
        continuous: true,
        interimResults: true,
        maxAlternatives: 1,
        commands: {
            compose: 'compose',
            refresh: 'refresh',
            focusMode: 'focus mode',
            search: 'search',
            open: 'open',
            markRead: 'mark as read',
            star: 'star',
            archive: 'archive'
        }
    },
    
    // Thread Visualization Settings
    THREAD_VIZ_SETTINGS: {
        nodeSize: 20,
        linkDistance: 100,
        linkStrength: 0.7,
        charge: -300,
        minZoom: 0.5,
        maxZoom: 3,
        colors: {
            node: '#4f46e5',
            link: '#818cf8',
            text: '#1f2937',
            highlight: '#10b981'
        }
    },
    
    // Focus Mode Settings
    FOCUS_MODE: {
        defaultDuration: 25, // minutes
        breakDuration: 5, // minutes
        longBreakDuration: 15, // minutes
        sessionsUntilLongBreak: 4,
        notifications: {
            enabled: true,
            sound: true,
            desktop: true
        },
        autoStartBreaks: false,
        autoStartPomodoros: false
    },
    
    // Collaboration Settings
    COLLABORATION: {
        maxCollaborators: 10,
        maxSharedLabels: 20,
        activityLogSize: 50,
        refreshInterval: 30000, // 30 seconds
        permissions: {
            view: ['read'],
            edit: ['read', 'write', 'share'],
            admin: ['read', 'write', 'share', 'manage']
        },
        notificationTypes: {
            newCollaborator: true,
            sharedEmail: true,
            labelChange: true,
            mention: true
        }
    }
};

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 

// Google OAuth2 configuration
const config = {
    clientId: '707809225486-qs8elc8gokrbgrr2r50dtqf6kv6litjj.apps.googleusercontent.com', // Replace with your actual Google Client ID
    apiKey: 'AIzaSyBqdOlaL21qWByQIdDlFBcvNRWos2Pl-CA', // Replace with your actual Google API Key
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
    scopes: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.labels'
    ]
}; 

// Add these if they're missing
CONFIG.UI_SETTINGS = CONFIG.UI_SETTINGS || {};
CONFIG.UI_SETTINGS.themes = CONFIG.UI_SETTINGS.themes || {
    light: {
        primary: '#4f46e5'
    }
}; 