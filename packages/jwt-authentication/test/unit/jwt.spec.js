import jsonwebtoken from 'jsonwebtoken';
import sinon from 'sinon';
import { ForbiddenException } from '@jordanforeman/rest-exceptions';
import { expect } from 'chai';

import { jwt } from '../../src/jwt';

describe('Basic JWT Authentication', () => {
    let token,
        key,
        options,
        authStrategy,
        request,
        response,
        next;

    beforeEach(() => {
        key = Symbol('secretOrPublicKey');
        options = Symbol('jsonwebtoken::options');
        token = Symbol('jwt');
        request = {
            headers: {
                'x-access-token': token
            }
        };
        response = {
            status: sinon.stub(),
            json: sinon.stub()
        };
        next = sinon.stub();

        sinon.stub(jsonwebtoken, 'verify');

        authStrategy = jwt(key, options);
    });

    afterEach(sinon.restore);

    describe('Good JWT', () => {
        let jwtBody;

        beforeEach(async () => {
            jwtBody = Symbol('jwt body');
            jsonwebtoken.verify.resolves(jwtBody);

            await authStrategy(request, response, next);
        });

        it('should attempt to verify the jwt', () => {
            expect(jsonwebtoken.verify.callCount).to.equal(1);
            expect(jsonwebtoken.verify.firstCall.args).to.deep.equal([token, key, options]);
        });

        it('should persist the jwt body on the request', () => {
            expect(request.auth).to.equal(jwtBody);
        });

        it('should defer to the next handler', () => {
            expect(next.callCount).to.equal(1);
        });

        it('should not return any response', () => {
            expect(response.status.callCount).to.equal(0);
            expect(response.json.callCount).to.equal(0);
        });
    });

    describe('Bad JWT', () => {
        let resultingError;

        beforeEach(async () => {
            jsonwebtoken.verify.rejects();

            try {
                await authStrategy(request, response, next);
            } catch (e) {
                resultingError = e;
            }
        });

        it('should attempt to verify the jwt', () => {
            expect(jsonwebtoken.verify.callCount).to.equal(1);
            expect(jsonwebtoken.verify.firstCall.args).to.deep.equal([token, key, options]);
        });

        it('should not defer to the next handler', () => {
            expect(next.callCount).to.equal(0);
        });

        it('should throw a forbidden', () => {
            expect(resultingError).to.be.instanceOf(ForbiddenException);
        });
    });
});
