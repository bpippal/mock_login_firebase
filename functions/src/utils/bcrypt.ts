import bcrypt from 'bcryptjs';

export const comparePassword = async (password: string, hashedPassword: string) => {
    return bcrypt.compare(password , hashedPassword);
}; // TODO

export const hashPassword = (password: string) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password , salt);
}; // TODO
