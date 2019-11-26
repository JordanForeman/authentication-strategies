import { verify } from 'jsonwebtoken';
import { ForbiddenException } from '@jordanforeman/rest-exceptions';

export const jwt = (secretOrPublicKey, options) => async (request, response, next) => {
    const token = request.headers['x-access-token'];

    try {
        request.auth = await verify(token, secretOrPublicKey, options);

        next();
    } catch (e) {
        throw new ForbiddenException();
    }
};
