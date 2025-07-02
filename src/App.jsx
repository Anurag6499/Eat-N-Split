import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Nitesh",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: 100,
  },
  {
    id: 933372,
    name: "Shubham",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: -20,
  },
  {
    id: 499476,
    name: "Harshit",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 1000,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [isSelectedFriend, setIsSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    console.log("object of handleAddFriend");
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    setIsSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === isSelectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setIsSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelectedFriend}
          isSelectedFriend={isSelectedFriend}
        />
        {showAddFriend && <FormAddFriend addOneFriend={handleAddFriend} />}
        <Button onClick={() => setShowAddFriend((show) => !show)}>{`${
          showAddFriend ? "Close Friend" : "Add Friend"
        }`}</Button>
      </div>
      {isSelectedFriend && (
        <SplitBill
          isSelectedFriend={isSelectedFriend}
          handleSplitBill={handleSplitBill}
          key={initialFriends.id}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, isSelectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          isSelectedFriend={isSelectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, isSelectedFriend }) {
  const selectedFriend = isSelectedFriend?.id === friend.id;
  return (
    <li className={selectedFriend ? "selected" : ""}>
      <img src={friend.image} alt={"img"} />
      <h3>{friend.name}</h3>
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      {friend.balance > 0 && (
        <p className="green">
          You owned {friend.name} ${friend.balance}{" "}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          {" "}
          {friend.name} owened you ${Math.abs(friend.balance)}{" "}
        </p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {selectedFriend ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ addOneFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    console.log("handleSubmit");

    const id = crypto.randomUUID();
    const newObject = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    addOneFriend(newObject);
    setImage("https://i.pravatar.cc/");
    setName("");
  }

  return (
    <form className=" form-split-bill " onSubmit={handleSubmit}>
      <label htmlFor="">🧍‍♂️Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="">👦Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function SplitBill({ isSelectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [userPaidBill, setUserPaidBill] = useState("");
  const friendPayBill = bill ? bill - userPaidBill : "";
  const [whoPayBill, setWhoPayBill] = useState("user");

  function handleBill(e) {
    e.preventDefault();

    if (!bill || !userPaidBill) return;
    handleSplitBill(whoPayBill === "user" ? friendPayBill : -userPaidBill);
  }
  return (
    <form className="form-split-bill" onSubmit={handleBill}>
      <h2>Split the Bill With {isSelectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your expense</label>
      <input
        type="text"
        value={userPaidBill}
        onChange={(e) =>
          setUserPaidBill(
            Number(e.target.value) > bill
              ? userPaidBill
              : Number(e.target.value)
          )
        }
      />

      <label>{isSelectedFriend.name} expense</label>
      <input type="text" value={friendPayBill} disabled />

      <label>Who pay the Bill</label>
      <select
        value={whoPayBill}
        onChange={(e) => setWhoPayBill(e.target.value)}
      >
        <option value="user">You </option>
        <option value="friend">{isSelectedFriend.name}</option>
      </select>

      <Button>split bill</Button>
    </form>
  );
}
