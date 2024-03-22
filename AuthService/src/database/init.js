const {Sequelize} = require('sequelize');
const bcrypt = require('bcrypt');
const { getRoleNumber } = require('shared/utils/roles');
/**
 * 
 * @param {Sequelize} db 
 */
module.exports = async (db) => {   
    console.log('Attempting to sync models')
    try {
        await db.models.auth.sync({ force: !process.env.ONLINE })
        console.log('Models successfully synced');

        console.log('Attempting to create admin account')
        try {
            const username = 'admin';
            const email = 'email@mail.com';
            const password = 'password';
            const role = getRoleNumber({
                canAdjustRoles: true,
                canDeleteCookbooks: true,
                canDeletePosts: true,
                canDeleteUsers: true,
                canSeePrivateCookbooks: true,
                canSeePrivatePosts: true,
                canSeeRoles: true,
                canSuspendUsers: true
            });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await db.models.auth.create({ username, password: hashedPassword, email, role });
            console.log('Admin successfully created');
        } catch (error) {
            console.error('Unable to create admin:');
            console.error(error.message);
            process.exit(1);
        }
    } catch (error) {
        console.error('Unable to sync the models:');
        console.error(error.message);
        process.exit(1);
    }
}