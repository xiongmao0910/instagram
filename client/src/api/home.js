import { privateInstance } from '../constants';

async function home(id) {
    try {
        const response = await privateInstance.get('/', {
            headers: {
                currentUserId: id,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export { home };
