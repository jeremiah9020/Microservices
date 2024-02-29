

module.exports = async (db) => {
    if (process.env.ONLINE) {
        return;
    }
    
    console.log('Attempting to sync books model')
    try {
        await db.models.book.sync({ force: true })
        console.log('Books model successfully synced');
        
        console.log('Attempting to create a book');
        try {
            await db.models.book.create({
                title: 'Anne of Green Gables',
                author: 'Lucy Montgomery',
                release_date: '1909',
                subject: '0'
            });
            console.log('Book successfully created');
        } catch (error) {
            console.error('Unable to create a book:');
            console.error(error.message);
            process.exit(1);
        }
    } catch (error) {
        console.error('Unable to sync the books model:');
        console.error(error.message);
        process.exit(1);
    }
}