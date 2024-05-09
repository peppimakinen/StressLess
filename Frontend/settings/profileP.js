import { fetchData } from "../assets/fetch.js";
import { showSnackbar } from "../snackbar.js";

function initialPageReload() {
  if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
  }
}
initialPageReload();

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
  const url = `https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/auth/me`;
  const token = localStorage.getItem("token");

  const options = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
      },
  };
  
  console.log("Fetching entry count...");
  try {
      const responseData = await fetchData(url, options);
      console.log("Data received:", responseData);
      if (responseData && responseData.stressLessUser) {
          const entryCount = responseData.stressLessUser.entry_count || 0;
          console.log("Entry count fetched:", entryCount);
          localStorage.setItem("entry_count", entryCount);
          document.getElementById("count").textContent = entryCount;
      } else {
          console.log('No entries found');
          document.getElementById("count").textContent = "0";
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
        const response = await fetch('https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/users', {
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
  
  
  document.addEventListener('DOMContentLoaded', function() {
    showProfile();
    getEntryCount();
});
