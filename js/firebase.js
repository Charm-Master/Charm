   // Import the Firebase modules
   import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
   import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
   import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

   // Your web app's Firebase configuration
   const firebaseConfig = {
       apiKey: "AIzaSyDs-JGgBTA3ncI8RdDLvY17P8gO7KbHE-g",
       authDomain: "officialcharmdata.firebaseapp.com",
       projectId: "officialcharmdata",
       storageBucket: "officialcharmdata.appspot.com",
       messagingSenderId: "978863054747",
       appId: "1:978863054747:web:6074fcf487cda2fbe50b3e",
       measurementId: "G-BD9EZRYCGZ"
   };

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const auth = getAuth();
   const db = getFirestore();

   let loggedInUser = null;
   let currentAccount = null; // Store the current account being managed

   // DOM Elements
   const loginArea = document.getElementById('loginArea');
   const userInfo = document.getElementById('userInfo');
   const adminSection = document.getElementById('adminSection');
   const loggedInAs = document.getElementById('loggedInAs');
   const accountList = document.getElementById('accountList');
   const accountModal = document.getElementById('accountModal');
   const accountDetails = document.getElementById('accountDetails');
   const newEmailInput = document.getElementById('newEmailInput');

   // Functions

   // Create Account
   async function createAccount(username, email, password) {
       try {
           const userCredential = await createUserWithEmailAndPassword(auth, email, password);
           const user = userCredential.user;
           // Add additional user data to Firestore
           await addDoc(collection(db, "accounts"), {
               uid: user.uid,
               username: username,
               email: email,
               status: 'active',
               verified: false,
               isAdmin: false // Set to true manually in Firestore for admin users
           });
           alert('Account created successfully.');
           clearCreateAccountForm();
       } catch (error) {
           console.error("Error creating account:", error);
           alert(`Error creating account: ${error.message}`);
       }
   }

   // Login
   async function login(email, password) {
       try {
           const userCredential = await signInWithEmailAndPassword(auth, email, password);
           loggedInUser = userCredential.user;
           alert('Logged in successfully.');
       } catch (error) {
           console.error("Error logging in:", error);
           alert(`Error logging in: ${error.message}`);
       }
   }

   // Logout
   async function logout() {
       try {
           await signOut(auth);
           loggedInUser = null;
           alert('Logged out successfully.');
       } catch (error) {
           console.error("Error logging out:", error);
           alert(`Error logging out: ${error.message}`);
       }
   }

   // Update UI based on authentication state
   onAuthStateChanged(auth, async (user) => {
       if (user) {
           loggedInUser = user;
           await updateUI();
       } else {
           loggedInUser = null;
           await updateUI();
       }
   });

   // Update UI Function
   async function updateUI() {
       if (loggedInUser) {
           loginArea.classList.add('hidden');
           userInfo.classList.remove('hidden');
           loggedInAs.textContent = `Logged in as: ${loggedInUser.email}`;

           // Fetch user data from Firestore
           const accountsSnapshot = await getDocs(collection(db, "accounts"));
           let userData = null;
           accountsSnapshot.forEach(doc => {
               if (doc.data().uid === loggedInUser.uid) {
                   userData = doc.data();
               }
           });

           if (userData && userData.isAdmin) {
               adminSection.classList.remove('hidden');
               await updateAccountList();
           } else {
               adminSection.classList.add('hidden');
           }
       } else {
           loginArea.classList.remove('hidden');
           userInfo.classList.add('hidden');
           adminSection.classList.add('hidden');
           accountList.innerHTML = '';
       }
   }

   // Update Account List for Admin
   async function updateAccountList() {
       accountList.innerHTML = '';
       const accountsSnapshot = await getDocs(collection(db, "accounts"));
       accountsSnapshot.forEach(docSnap => {
           const account = docSnap.data();
           const accountItem = document.createElement('div');
           accountItem.classList.add('account-item');
           accountItem.innerHTML = `
               <span>${account.username} (${account.email}) - Status: ${account.status} - Verified: ${account.verified}</span>
               <div>
                   <button onclick="openAccountModal('${docSnap.id}')">Manage</button>
               </div>
           `;
           accountList.appendChild(accountItem);
       });
   }

   // Open Account Modal
   async function openAccountModal(docId) {
       try {
           const docRef = doc(db, "accounts", docId);
           const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
               currentAccount = { id: docId, ...docSnap.data() };
               accountDetails.textContent = `Managing: ${currentAccount.username} (${currentAccount.email})`;
               newEmailInput.value = ''; // Clear email input
               accountModal.style.display = "block";
           } else {
               alert("No such document!");
           }
       } catch (error) {
           console.error("Error opening account modal:", error);
           alert(`Error opening account modal: ${error.message}`);
       }
   }

   // Change Email
   async function changeEmail(newEmail) {
       if (!currentAccount) return;
       try {
           const docRef = doc(db, "accounts", currentAccount.id);
           await updateDoc(docRef, {
               email: newEmail
           });
           alert(`Email for ${currentAccount.username} has been changed to ${newEmail}.`);
           await updateAccountList();
           closeModal();
       } catch (error) {
           console.error("Error changing email:", error);
           alert(`Error changing email: ${error.message}`);
       }
   }

   // Delete Account
   async function deleteAccount() {
       if (!currentAccount) return;
       try {
           const docRef = doc(db, "accounts", currentAccount.id);
           await deleteDoc(docRef);
           alert(`${currentAccount.username} has been deleted.`);
           await updateAccountList();
           closeModal();
       } catch (error) {
           console.error("Error deleting account:", error);
           alert(`Error deleting account: ${error.message}`);
       }
   }

   // Ban Account
   async function banAccount() {
       if (!currentAccount) return;
       try {
           const docRef = doc(db, "accounts", currentAccount.id);
           await updateDoc(docRef, {
               status: 'banned'
           });
           alert(`${currentAccount.username} has been banned.`);
           await updateAccountList();
           closeModal();
       } catch (error) {
           console.error("Error banning account:", error);
           alert(`Error banning account: ${error.message}`);
       }
   }

   // Unban Account
   async function unbanAccount() {
       if (!currentAccount) return;
       try {
           const docRef = doc(db, "accounts", currentAccount.id);
           await updateDoc(docRef, {
               status: 'active'
           });
           alert(`${currentAccount.username} has been unbanned.`);
           await updateAccountList();
           closeModal();
       } catch (error) {
           console.error("Error unbanning account:", error);
           alert(`Error unbanning account: ${error.message}`);
       }
   }

   // Toggle Verification
   async function toggleVerification() {
       if (!currentAccount) return;
       try {
           const docRef = doc(db, "accounts", currentAccount.id);
           await updateDoc(docRef, {
               verified: !currentAccount.verified
           });
           alert(`${currentAccount.username} verification status changed to ${!currentAccount.verified ? 'verified' : 'not verified'}.`);
           await updateAccountList();
           closeModal();
       } catch (error) {
           console.error("Error toggling verification:", error);
           alert(`Error toggling verification: ${error.message}`);
       }
   }

   // Close Modal
   function closeModal() {
       accountModal.style.display = "none";
   }

   // Clear Create Account Form
   function clearCreateAccountForm() {
       document.getElementById('createUsernameInput').value = '';
       document.getElementById('createEmailInput').value = '';
       document.getElementById('createPasswordInput').value = '';
   }

   // Event Listeners
   document.getElementById('createAccountBtn').addEventListener('click', () => {
       const username = document.getElementById('createUsernameInput').value.trim();
       const email = document.getElementById('createEmailInput').value.trim();
       const password = document.getElementById('createPasswordInput').value.trim();
       if (username && email && password) {
           createAccount(username, email, password);
       } else {
           alert('Please fill in all fields to create an account.');
       }
   });

   document.getElementById('loginBtn').addEventListener('click', () => {
       const email = document.getElementById('loginUsernameInput').value.trim();
       const password = document.getElementById('loginPasswordInput').value.trim();
       if (email && password) {
           login(email, password);
       } else {
           alert('Please enter both email and password to login.');
       }
   });

   document.getElementById('logoutBtn').addEventListener('click', logout);

   document.getElementById('changeEmailBtn').addEventListener('click', () => {
       const newEmail = newEmailInput.value.trim();
       if (newEmail) {
           changeEmail(newEmail);
       } else {
           alert('Please enter a new email.');
       }
   });

   document.getElementById('deleteAccountBtn').addEventListener('click', deleteAccount);
   document.getElementById('banAccountBtn').addEventListener('click', banAccount);
   document.getElementById('unbanAccountBtn').addEventListener('click', unbanAccount);
   document.getElementById('toggleVerificationBtn').addEventListener('click', toggleVerification);
   document.getElementById('closeModal').addEventListener('click', closeModal);

   // Close modal if clicked outside
   window.addEventListener('click', (event) => {
       if (event.target == accountModal) {
           closeModal();
       }
   });

