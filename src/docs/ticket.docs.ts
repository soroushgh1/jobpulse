export const createTicketCreated = {
  status: 201,
  example: {
    slug: 'my-ticket-slug-1',
    message: 'your ticket created successfully.',
    success: true,
  },
};

export const createTicketBadRequest = {
  status: 400,
  example: {
    statusCode: 400,
    message: 'there was a problem while creating your ticket.',
  },
};

export const adminViewTicketsOK = {
  status: 200,
  example: {
    tickets: [
      {
        id: 1,
        slug: 'my-ticket-slug-1',
        subject: 'Login Issue',
        description: 'Cannot login with valid credentials',
        isAnswered: false,
      },
      {
        id: 2,
        slug: 'my-ticket-slug-2',
        subject: 'Bug report',
        description: 'App crashes on startup',
        isAnswered: true,
      },
    ],
    success: true,
  },
};

export const userViewTicketOK = {
  status: 200,
  example: {
    ticket: {
      id: 1,
      slug: 'my-ticket-slug-1',
      subject: 'Login Issue',
      description: 'Cannot login with valid credentials',
      isAnswered: false,
    },
    success: true,
  },
};

export const userViewTicketNotFound = {
  status: 404,
  example: {
    statusCode: 404,
    message: 'ticket not found',
  },
};

export const userViewTicketUnauthorized = {
  status: 401,
  example: {
    statusCode: 401,
    message: 'you can not access other people tickets',
  },
};

export const attachTicketOK = {
  status: 200,
  example: {
    message: 'ticket attached',
    success: true,
  },
};

export const attachTicketBAD = {
  status: 404,
  example: {
    statusCode: 404,
    message: 'ticket not found',
  },
};

export const messageOK = {
  status: 200,
  example: {
    message: 'message sent',
    success: true,
  },
};

export const messageBAD = {
  status: 404,
  example: {
    statusCode: 404,
    message: 'replyed message not found',
  },
};

export const myTicketsOK = {
  status: 200,
  example: {
    ticket: [
      {
      id: 1,
      slug: 'my-ticket-slug-1',
      subject: 'Login Issue',
      description: 'Cannot login with valid credentials',
      isAnswered: false,
      },
      {
      id: 1,
      slug: 'my-ticket-slug-2',
      subject: 'resume Issue',
      description: 'Cannot send resume',
      isAnswered: true,
      }
    ],
    success: true,
  },
};