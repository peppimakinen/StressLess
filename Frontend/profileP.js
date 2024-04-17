function showProfile() {
    const user_name = localStorage.getItem('user_name');
    const nameSpan = document.getElementById("name");

    const user_email = localStorage.getItem('user_email');
    const emailSpan = document.getElementById("email");

    nameSpan.textContent = user_name;
    emailSpan.textContent = user_email;
}

const deleteUser = async (req, res, next) => {
    try {
      // Check if token is linked to admin user
      if (req.user.user_level === 'admin') {
        const userId = req.params.id; // Extract user ID from request parameters
        const result = await deleteUserById(userId); // Call deleteUserById function
        // Check for error in db
        if (result.error) {
          next(customError(result.message, result.error));
        } else {
          // Respond with a ok status - User deleted successfully
          return res.json(result);
        }
      } else {
        // Unauthorized user was trying to reach this function
        next(customError('Unauthorized', 401));
      }
    } catch (error) {
      // Handle unexpected errors
      next(customError('Internal Server Error', 500));
    }
  };
  

showProfile();
