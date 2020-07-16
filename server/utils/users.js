const users = [];

function userJoin(id, userName) {
    const user = { id, userName }

    users.push(user)

    return user
}

module.exports = {
    userJoin
}