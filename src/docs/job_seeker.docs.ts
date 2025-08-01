export const makeRequestOK = {
  status: 201,
  description: 'Request created successfully',
  example: {
    message: 'request created successfully',
    success: true,
  },
};

export const makeRequestBAD = {
  status: 400,
  description: 'You already sent a request for this position',
  example: {
    statusCode: 400,
    message: 'you already sent a request for this position',
  },
};

export const deleteRequestOK = {
  status: 200,
  description: 'Request deleted successfully',
  example: {
    message: 'request deleted successfully',
    success: true,
  },
};

export const deleteRequestBAD = {
  status: 400,
  description: 'You did not send a request to this position',
  example: {
    statusCode: 400,
    message: 'you did not sent a request to this position',
  },
};

export const showMyRequestsOK = {
  status: 200,
  description: 'List of User requests',
  example: {
    requests: [
      "<myrequest_1>",
      "<myrequest_2>",
      "<myrequest_3>",
    ],
    success: true,
  },
};

export const showAllRequestsOK = {
  status: 200,
  description: 'List of all requests for position (company access)',
  example: {
    requests: [
      "<request_1>",
      "<request_2>",
      "<request_3>",
    ],
    success: true,
  },
};

export const showAllRequestsUNAUTHORIZED = {
  status: 401,
  description: 'Unauthorized to check the requests',
  example: {
    statusCode: 401,
    message: 'you are not the owner of the company for checking the requests',
  },
};

export const showMyNotificationsOK = {
  status: 200,
  description: 'List of user notifications',
  example: {
    success: true,
    notifications: ['Request accepted'],
  },
};

export const showMyNotificationsBAD = {
  status: 400,
  description: 'Trouble in getting notification',
  example: {
    statusCode: 400,
    message: 'trouble in getting notification',
  },
};