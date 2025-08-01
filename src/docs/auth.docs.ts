export const registerOK = {
  status: 201,
  example: {
    message: 'user created successfully.',
    success: 'true',
  },
};

export const registerBAD = {
  status: 400,
  example: {
    message: [
      'minimum length of phone is 12',
      'phone can not be empty',
      'phone must be a string',
      'secret can not be empty'
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
};

export const loginOK = {
  status: 200,
  example: {
    message: 'login successful',
    success: 'true',
  },
};

export const loginBAD = {
  status: 500,
  example: {
    statusCode: 500,
    message: 'user not found',
  },
};

export const refreshOK = {
  status: 200,
  example: {
    message: 'access token attached successfully.',
    success: 'true',
  },
};

export const refreshBAD = {
  status: 500,
  example: {
    statusCode: 500,
    message: 'no refresh token found',
  },
};

export const authStatusOK = {
  status: 200,
  example: {
    access_token: "<token>",
    refresh_token: "<token>",
  },
};

export const authStatusBAD = {
  status: 500,
  example: {
    statusCode: 500,
    message: 'no refresh token found',
  },
};

export const adminRegisterOK = {
  status: 201,
  example: {
    message: 'admin created successfully.',
    success: 'true',
  },
};

export const adminRegisterBAD = {
  status: 400,
  example: {
    message: [
      'minimum length of phone is 12',
      'phone can not be empty',
      'phone must be a string',
      'secret can not be empty'
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
};

export const adminLoginOK = {
  status: 200,
  example: {
    message: 'login successful',
    success: 'true',
  },
};

export const adminLoginBAD = {
  status: 500,
  example: {
    statusCode: 500,
    message: 'user not found',
  },
};