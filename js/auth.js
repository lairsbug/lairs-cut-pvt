const firebaseConfig = {
  apiKey: "AIzaSyDi3kdEmQA6_y6Am4k2trh7rpAdNZ8Xql4",
  authDomain: "lairscut-5dcb2.firebaseapp.com",
  projectId: "lairscut-5dcb2",
  storageBucket: "lairscut-5dcb2.firebasestorage.app",
  messagingSenderId: "697837331208",
  appId: "1:697837331208:web:adbd0dc55b21d66b36c2bd",
  measurementId: "G-6FPMDN0QF3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Google Auth Logic
const loginBtn = document.getElementById('googleLogin');
if (loginBtn) {
    loginBtn.onclick = () => {
        auth.signInWithPopup(provider)
            .then(() => {
                window.location.href = "index.html";
            }).catch((error) => {
                console.error("Auth Error:", error.message);
            });
    };
}

// Global Session Listener (Runs on both index and auth pages)
auth.onAuthStateChanged((user) => {
    const sidebarSignup = document.getElementById('sidebarSignup');
    if (user && sidebarSignup) {
        // Transform the signup button into a user badge
        sidebarSignup.innerHTML = `
            <div class="flex items-center gap-3 px-1">
                <div class="w-6 h-6 rounded-full overflow-hidden border border-indigo-500/50">
                    <img src="${user.photoURL}" alt="User" class="w-full h-full">
                </div>
                <div class="flex-1 text-left">
                    <div class="text-[9px] font-black text-white truncate uppercase">${user.displayName.split(' ')[0]}</div>
                    <div class="text-[7px] text-indigo-400 font-bold uppercase tracking-widest">Pro Member</div>
                </div>
                <svg class="w-3 h-3 text-gray-600 hover:text-red-400 transition-colors cursor-pointer" id="logoutIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </div>
        `;
        sidebarSignup.onclick = null; // Disable original redirect
        document.getElementById('logoutIcon').onclick = (e) => {
            e.stopPropagation();
            if(confirm("Logout?")) auth.signOut().then(() => location.reload());
        };
    }
});