export const createPositionOK = {
  status: 201,
  example: {
    message: 'position created successfully.',
    success: true,
  },
};

export const createPositionBAD = {
  status: 400,
  example: {
    message: 'invalid input or position could not be created',
    statusCode: 400,
  },
};

export const showOneOK = {
  status: 200,
  example: {
    position: {
      id: 123,
      title: 'Software Engineer',
      slug: 'software-engineer',
      description: 'Position description here',
      company: 'Example Company',
      // ... other fields you have
    },
    success: true,
  },
};

export const showOneNotFound = {
  status: 404,
  example: {
    statusCode: 404,
    message: 'position not found',
  },
};

export const updatePositionOK = {
  status: 200,
  example: {
    message: 'position updated successfully',
    success: true,
  },
};

export const updatePositionBAD = {
  status: 400,
  example: {
    message: 'there was a problem updating the position',
    statusCode: 400,
  },
};

export const deletePositionOK = {
  status: 200,
  example: {
    message: 'position deleted successfully',
    success: true,
  },
};

export const deletePositionNotFound = {
  status: 404,
  example: {
    statusCode: 404,
    message: 'position not found',
  },
};

export const showMyCompanyPositionsOK = {
  status: 200,
  example: {
    positions: [
      '<position_object_1>',
      '<position_object_2>',
      '<position_object_3>',
    ],
    success: true,
  },
};

export const allPositionsOfCompanyOK = {
  status: 200,
  example: {
    positions: [
      '<position_object_1>',
      '<position_object_2>',
      '<position_object_3>',
    ],
    success: true,
  },
};

export const searchPositionsOK = {
  status: 200,
  example: {
    result: [
      '<position_object_1>',
      '<position_object_2>',
      '<position_object_3>',
    ],
    success: true,
  },
};