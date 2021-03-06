const login = async (email, password) => {
  try {
    console.log({ email, password });
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    console.log(res);
  } catch (error) {
    console.log(error.response.data);
  }
};

document.querySelector('.click').addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/5c8a1d5b0190b214360dc057',
    });

    console.log(res);
  } catch (error) {
    console.log(error.response.data);
  }
});

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});
