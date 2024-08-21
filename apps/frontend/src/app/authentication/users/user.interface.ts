/**
 * Represents a user in the system.
 * 
 * @export User
 * @interface User
 * 
 * @property {string} username Username
 * @property {string} password Password
 * @property {number} id User ID
 * @property {string} createdAt Created at
 * @property {string} updatedAt Updated at
 * @property {string} deletedAt Deleted at
 * @property {string} resetToken Reset token
 * @property {string} [email] Email
 * @property {string} [role] Role
 * @property {string} [firstName] First name
 * @property {string} [lastName] Last name
 * @property {string} [avatar] Avatar
 * @property {string} [bio] Bio
 * @property {string} [location] Location
 * @property {string} [website] Website
 */
export interface User {
    username: string;
    password: string;
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    resetToken: string;
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
}