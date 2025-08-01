// company.docs.ts

export const createCompanyOK = {
  status: 201,
  example: {
    message: 'company created successfully.',
    success: 'true',
  },
};

export const createCompanyBAD = {
  status: 400,
  example: {
    message: 'phone or email is used',
    statusCode: 400,
  },
};

export const attachPictureOK = {
  status: 201,
  example: {
    success: true,
    result: '<string result from service>',
  },
};

export const updateCompanyOK = {
  status: 200,
  example: {
    message: 'company updated successfully',
    success: 'true',
  },
};

export const updateCompanyBAD = {
  status: 400,
  example: {
    message: 'there was a problem in updating company',
    statusCode: 400,
  },
};

export const showCompanyOK = {
  status: 200,
  example: {
    company: {
      id: 101,
      name: 'my good company',
      slug: 'my-good-company',
      description: 'A tech company specializing in innovative solutions.',
      pictures: [
        'https://www.example.com/image1.jpg',
        'https://www.example.com/image2.jpg',
      ],
      address: 'random address',
      phone: '091111111111111',
      email: 'example@gmail.com',
    },
    success: true,
  },
};

export const showCompanyNOTFOUND = {
  status: 404,
  example: {
    statusCode: 404,
    message: 'company not found',
  },
};

export const deleteCompanyOK = {
  status: 200,
  example: {
    success: 'true',
    message: 'company deleted successfully',
  },
};

export const deleteCompanyNOTFOUND = {
  status: 404,
  example: {
    statusCode: 404,
    message: 'company not found',
  },
};

export const viewAllOK = {
  status: 200,
  description: 'Fetching all companies',
  example: {
    companies: ['<company_object1>', '<company_object2>', '<company_object3>'],
    success: 'true',
  },
};

export const viewAllINTERNALERROR = {
  status: 500,
  example: {
    statusCode: 500,
    message: 'internal error',
  },
};

export const denyRequestOK = {
  status: 200,
  description: 'Request denied successfully',
  example: {
    message: 'request denied successfully',
    success: true,
  },
};

export const denyRequestBAD = {
  status: 400,
  description: 'Invalid deny request input',
  example: {
    statusCode: 400,
    message: 'invalid deny request input',
  },
};

export const acceptRequestOK = {
  status: 200,
  description: 'Request accepted successfully',
  example: {
    message: 'request accepted successfully',
    success: true,
  },
};

export const acceptRequestNOTFOUND = {
  status: 404,
  description: 'Request not found',
  example: {
    statusCode: 404,
    message: 'request not found',
  },
};