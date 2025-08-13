// User management system
class UserManager {
    constructor() {
        this.users = []; // Store registered users
        this.loggedInUsers = []; // Store currently logged in users
        this.currentUser = null;
        this.init();
    }

    init() {
        // Load existing data from memory (in a real app, this would be from a database)
        this.loadInitialData();
        this.bindEvents();
        this.checkLoginStatus();
    }

    loadInitialData() {
        // Add some sample users for demonstration
        this.users = [
            { name: 'Alice', clashId: 'ALICE123', password: 'password123' },
            { name: 'Bob', clashId: 'BOB456', password: 'password456' },
            { name: 'Charlie', clashId: 'CHARLIE789', password: 'password789' }
        ];
        
        // Simulate some users being online
        this.loggedInUsers = [
            { name: 'Alice', clashId: 'ALICE123', loginTime: Date.now() },
            { name: 'Bob', clashId: 'BOB456', loginTime: Date.now() - 300000 } // 5 minutes ago
        ];
    }

    bindEvents() {
        // Register form event
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Login form event
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button event
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }

    handleRegister() {
        const name = document.getElementById('registerName').value.trim();
        const clashId = document.getElementById('registerClashId').value.trim();
        const password = document.getElementById('registerPassword').value;

        // Clear previous error
        this.clearError('registerError');

        // Validate input
        if (!name || !clashId || !password) {
            this.showError('registerError', 'All fields are required!');
            return;
        }

        // Check if user already exists
        const existingUser = this.users.find(user => 
            user.name.toLowerCase() === name.toLowerCase() || 
            user.clashId.toLowerCase() === clashId.toLowerCase()
        );

        if (existingUser) {
            this.showError('registerError', 'User with this name or Clash ID already exists!');
            return;
        }

        // Create new user
        const newUser = { name, clashId, password };
        this.users.push(newUser);
        
        // Show success message and clear form
        this.showSuccess('registerError', 'Account created successfully! You can now log in.');
        document.getElementById('registerForm').reset();
    }

    handleLogin() {
        const name = document.getElementById('loginName').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Clear previous error
        this.clearError('loginError');

        // Validate input
        if (!name || !password) {
            this.showError('loginError', 'Please enter both name and password!');
            return;
        }

        // Find user
        const user = this.users.find(u => 
            u.name.toLowerCase() === name.toLowerCase() && u.password === password
        );

        if (!user) {
            this.showError('loginError', 'Invalid name or password!');
            return;
        }

        // Check if user is already logged in
        const alreadyLoggedIn = this.loggedInUsers.find(u => 
            u.name.toLowerCase() === name.toLowerCase()
        );

        if (!alreadyLoggedIn) {
            // Add to logged in users
            this.loggedInUsers.push({
                name: user.name,
                clashId: user.clashId,
                loginTime: Date.now()
            });
        }

        // Set current user
        this.currentUser = user;

        // Switch to players view
        this.showPlayersSection();
        
        // Clear login form
        document.getElementById('loginForm').reset();
    }

    handleLogout() {
        if (this.currentUser) {
            // Remove from logged in users
            this.loggedInUsers = this.loggedInUsers.filter(u => 
                u.name.toLowerCase() !== this.currentUser.name.toLowerCase()
            );
            
            this.currentUser = null;
        }

        // Switch back to auth view
        this.showAuthSection();
    }

    showPlayersSection() {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('playersSection').classList.add('active');
        
        // Update welcome message
        document.getElementById('currentUserName').textContent = this.currentUser.name;
        
        // Update players list
        this.updatePlayersList();
    }

    showAuthSection() {
        document.getElementById('authSection').style.display = 'flex';
        document.getElementById('playersSection').classList.remove('active');
        
        // Clear any error messages
        this.clearError('loginError');
        this.clearError('registerError');
    }

    updatePlayersList() {
        const playersGrid = document.getElementById('playersGrid');
        playersGrid.innerHTML = '';

        if (this.loggedInUsers.length === 0) {
            playersGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: rgba(255, 255, 255, 0.7); font-size: 1.2rem;">
                    No other players online right now
                </div>
            `;
            return;
        }

        this.loggedInUsers.forEach(player => {
            const timeSinceLogin = Math.floor((Date.now() - player.loginTime) / 60000); // minutes
            const timeText = timeSinceLogin === 0 ? 'Just now' : `${timeSinceLogin}m ago`;
            
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.innerHTML = `
                <div class="player-name">${player.name}</div>
                <div class="player-clash-id">ID: ${player.clashId}</div>
                <div class="player-status">Online • ${timeText}</div>
            `;
            
            playersGrid.appendChild(playerCard);
        });
    }

    checkLoginStatus() {
        // In a real app, you'd check if user is already logged in via session/token
        // For now, we'll start with the auth section visible
        this.showAuthSection();
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.className = 'error-message';
    }

    showSuccess(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.className = 'success-message';
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }

    // Public method to get current user info (for other pages to use)
    getCurrentUser() {
        return this.currentUser;
    }

    // Public method to get all logged in users (for other pages to use)
    getLoggedInUsers() {
        return this.loggedInUsers;
    }
}

// Initialize the user manager when page loads
let userManager;

document.addEventListener('DOMContentLoaded', () => {
    userManager = new UserManager();
    
    // Update players list every 30 seconds to show updated "time since login"
    setInterval(() => {
        if (userManager.currentUser && document.getElementById('playersSection').classList.contains('active')) {
            userManager.updatePlayersList();
        }
    }, 30000);
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserManager;
}
