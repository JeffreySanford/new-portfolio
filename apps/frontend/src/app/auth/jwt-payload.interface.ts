import { User } from "../users/user.interface";

/**
 * Represents the payload of a JWT (JSON Web Token).
 * 
 * @export JwtPayload
 * @interface JwtPayload
 * @extends {User}
 * 
 * @property {string} [iss] Issuer
 * @property {string} [sub] Subject
 * @property {string} [aud] Audience
 * @property {number} [exp] Expiration time
 * @property {number} [nbf] Not before
 * @property {number} [iat] Issued at
 * @property {string} [jti] JWT ID
 * @property {string} createdAt Created at
 * @property {string} updatedAt Updated at
 * @property {string} deletedAt Deleted at
 * @property {string} resetToken Reset token
 * @property {string} resetTokenExpires Reset token expires
 * @property {string} confirmationToken Confirmation token
 */
export interface JwtPayload extends User {
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    resetToken: string;
    resetTokenExpires: string;
    confirmationToken: string;
}