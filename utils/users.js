const users = [];

//  Join User
const joinUser = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

//  Get Current USer

const currentUser = (id) => {
  return users.find((user) => user.id == id);
};

const userLeave = (id) => {
  const index = users.findIndex((user) => user.id == id);

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

const getRoomUsers = (room) => {
  return users.filter((user) => user.room == room);
};

module.exports = {
  joinUser,
  currentUser,
  userLeave,
  getRoomUsers,
};
