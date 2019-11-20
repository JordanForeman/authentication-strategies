import { verify } from 'jsonwebtoken';

const FORBIDDEN = 403;

export const jwt = (secretOrPublicKey, options) => async (request, response, next) => {
    const token = request.headers['x-access-token'];

    try {
        request.auth = await verify(token, secretOrPublicKey, options);

        next();
    } catch (e) {
        response.status(FORBIDDEN);
        response.json({ message: 'Must be authorized to view this resource' });
    }
};
