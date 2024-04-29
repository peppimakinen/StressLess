import { fetchData } from "../assets/fetch";
import { showSnackbar } from "../snackbar";

function showProfile() {
    const user_name = localStorage.getItem('user_name');
    const nameSpan = document.getElementById("name");
    nameSpan.textContent = user_name || "No name available";

    const user_email = localStorage.getItem('user_email');
    const emailSpan = document.getElementById("email");
    emailSpan.textContent = user_email || "No email available";

    const entry_count = localStorage.getItem('entry_count');
    const entrySpan = document.getElementById("count");
    entrySpan.textContent = entry_count || "0";
}



async function getEntryCount() {
    const url = `http://127.0.0.1:3000/api/auth/me`;
    const token = localStorage.getItem("token");

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    };
    
    try {
        const responseData = await fetchData(url, options); // Assuming fetchData returns JSON directly
        console.log(responseData);
        if (responseData && responseData.stressLessUser) {
            const entryCount = responseData.stressLessUser.entry_count || 0;
            localStorage.setItem("entry_count", entryCount);
        } else {
            console.log('No entries found');
        }
    } catch (error) {
        console.error('Error finding entries:', error);
        showSnackbar("Red","Merkintöjen määrää ei löytynyt.");
    }
}


//tilin poisto
document.querySelector('.pic a').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('deleteModal').style.display = 'block';
  });
  
  document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('deleteModal').style.display = 'none';
  });
  
  document.getElementById('confirmDeletion').addEventListener('click', async function() {
    const userInput = document.getElementById('deleteConfirm').value;
    if (userInput === 'Poista tili') {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/users', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
            showSnackbar("Green","Tili poistettu onnistuneesti");
            setTimeout(() => {
                window.location.href = '../login/loginpatient.html';
            }, 3000);
        } else {
          throw new Error('Failed to delete account');
        }
      } catch (error) {
        showSnackbar("Red", error.message);
      }
    } else {
        showSnackbar("Red", "Poistaminen epäonnistui: väärä teksti");
    }
    document.getElementById('deleteModal').style.display = 'none';
  });
  
  

showProfile();
getEntryCount();