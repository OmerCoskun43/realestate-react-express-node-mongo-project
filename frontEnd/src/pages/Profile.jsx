/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/features/userSlice";
import { useDispatch } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUplaodError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUplaodError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  // console.log("currentUser==> ", currentUser._id);
  // console.log(currentUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserFailure(data?.message));
        return;
      } else {
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handeChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data?.message));
      } else {
        dispatch(deleteUserSuccess());
      }
    } catch (error) {
      dispatch(deleteUserFailure(error?.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data?.message));
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      dispatch(signOutFailure(error?.message));
    }
  };

  const handleShowListings = async () => {
    setShowList(!showList);
    try {
      setShowListingsError(false);

      const res = await fetch(`/api/user/listings/${currentUser?._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
      console.log(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(error.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-4 ">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 " action="">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full  object-cover h-24 w-24 cursor-pointer self-center mt-2   "
          src={currentUser?.avatar}
          alt="avatart"
        />
        <p className="text-center font-bold">
          {fileUploadError ? (
            <span className="text-red-700 text-center">
              Error Image upload (image must be less than 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>Uploading... {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700 ">Uploaded Succesfuly</span>
          ) : (
            <span></span>
          )}{" "}
        </p>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          defaultValue={currentUser?.username}
          className="border p-3 rounded-lg "
          onChange={handeChange}
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          defaultValue={currentUser?.email}
          className="border p-3 rounded-lg "
          onChange={handeChange}
        />
        <input
          type="text"
          id="password"
          name="password"
          placeholder="Password"
          defaultValue={currentUser?.password}
          className="border p-3 rounded-lg "
          onChange={handeChange}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-green-700 text-white p-3 uppercase text-center hover:opacity-95 font-bold hover:underline"
        >
          {loading ? "Loading..." : "Update Profile"}
        </button>
        <Link
          className="text-white hover:underline font-bold bg-red-700 p-3 uppercase text-center hover:opacity-95"
          to="/create-listing"
        >
          {" "}
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-3">
        <span
          onClick={handleDelete}
          className="text-red-700 cursor-pointer hover:underline font-bold "
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700  cursor-pointer hover:underline font-bold"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 text-center">{error}</p>
      <p className="text-green-700 text-center">
        {updateSuccess && "Profile Updated Succesfuly"}
      </p>

      <button
        onClick={handleShowListings}
        className="text-white hover:underline font-bold bg-blue-700 p-3 uppercase text-center hover:opacity-95 w-full mt-6"
      >
        Show Listings
      </button>
      <p className="text-red-500 mt-1">
        {showListingsError ? "Error showing listings" : ""}{" "}
      </p>
      {showList && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 font-bold text-2xl ">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3  bg-blue-200 font-bold flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
