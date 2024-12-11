import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import Loading from "./Loading";
import { apiRequest } from "../until";
import { CiLock, CiUnlock } from "react-icons/ci";
import moment from "moment";
import {
  adminBlockUserId,
  admindeleteUser,
  admingetUserId,
} from "../until/admin";
import { useTranslation } from "react-i18next";
import { useTransition } from "react";

const UserCard = ({ user, setDetails, handleHistory, setUserInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  // console.log(user);

  // {
  //   verified: false,
  //   statusActive: true,
  //   _id: '6720e82e7a22680463770daa',
  //   firstName: 'Nguyen',
  //   lastName: 'Van A',
  //   email: 'nguyenvana123@example.com'
  // }

  // console.log(moment(user?.createdAt).format("MMMM Do YYYY, h:mm:ss a"));
  const handleloading = () => {
    setIsLoading(true);
  };
  // const changeStatususer = async () => {
  //   const res = await apiRequest({
  //     url: `admin/change-status-user/${userr?._id}`,
  //     token: user?.token,
  //     data: {},
  //     method: "PUT",
  //   });
  // };

  const setUser = (user) => {
    setUserInfo(user);
  };
  const rehandleloading = () => {
    setTimeout(() => setIsLoading(false), [3000]);
  };
  // useEffect(() => {
  //   setUser(user);
  // }, []);
  return (
    <div className="rounded-xl shadow-lg bg-ascent-3/10 w-[80%] h-full px-5 border border-[#66666645]">
      <div
        className="my-4 flex gap-5 w-full h-full  cursor-pointer"
        onClick={() => {
          setUser(user);
          setDetails();
        }}
      >
        <img
          className="h-20 w-20 object-cover rounded-full"
          src={
            user?.profileUrl
              ? user?.profileUrl
              : `https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg`
          }
          alt="Avatar"
        />
        <div className="flex w-full gap-4">
          <div className="flex flex-col text-right">
            <span className="text-ascent-2">{t("Name")}: </span>
            <span className="text-ascent-2">Id: </span>
            <span className="text-ascent-2">Email: </span>
            {/* <span className="text-ascent-2">Join at: </span> */}
            <span className="text-ascent-2">Verified: </span>
            <span className="text-ascent-2">Activity: </span>
          </div>
          <div className="w-full text-ascent-1 text-base flex flex-col items-start">
            <span className="max-h-6 overflow-hidden">
              {user?.firstName ? user?.firstName : "?"}{" "}
              {user?.lastName ? user?.lastName : "?"}
            </span>
            <span className="max-h-6 overflow-hidden">
              {user?._id ? user?._id : "?"}
            </span>
            <span className="max-h-6 overflow-hidden">
              {user?.email
                ? user?.email?.length > 25
                  ? user?.email.slice(0, 25) + "..."
                  : user?.email
                : "?"}
            </span>
            {/* <span className="max-h-6 overflow-hidden">
              {user?.createdAt
                ? moment(user?.createdAt).format("MMMM Do YYYY")
                : "?"}
            </span> */}
            <span className="max-h-6 overflow-hidden">
              {user?.verified === true ? "True" : "False"}
            </span>
            <div>
              {isLoading ? (
                <div className="mt-2">
                  <Loading />
                </div>
              ) : (
                <div className="">
                  {user?.statusActive === true ? (
                    <div>{t("Active")}</div>
                  ) : (
                    <div>{t("Wait")}</div>
                  )}
                  {/* <div className="flex px-1 items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer border rounded-full justify-center">
                <CiLock /> Lock
              </div>
              <div className="flex px-1 items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer border rounded-full justify-center">
                <CiUnlock /> Unlock
              </div> */}
                </div>

                // <input
                //   className=""
                //   type="checkbox"
                //   onChange={() => {
                //     handleloading();
                //     rehandleloading();
                //   }}
                // />
              )}
            </div>
          </div>
        </div>

        <div className="w-1/5 flex flex-col items-center justify-center gap-2">
          {/* <button
            onClick={() => {
              setUser(user);
              setDetails();
            }}
            className="w-full justify-center inline-flex items-center text-base bg-[#0444a4] text-white px-5 py-1 mt-2 rounded-full"
          >
            View Details
          </button> */}
          {/* <button
        onClick={() => {
          setUser(user);
          handleHistory();
        }}
        className="w-full justify-center inline-flex items-center text-base bg-[#0444a4] text-white px-5 py-1 mt-2 rounded-full"
      >
        History
      </button> */}
        </div>
      </div>
    </div>
  );
};

const DetailUser = ({ user, userInfo, setDetails, setUserInfo, fetchUser }) => {
  // const [userInfo, setuserInfo] = useState();
  // setInfo(userInfo.friends);
  const [active, setActive] = useState(userInfo?.statusActive);
  const { t } = useTranslation();

  // console.log(userInfo.friends);

  // console.log(user);
  // console.log(info);

  const changeActiveuser = async () => {
    try {
      const res = await adminBlockUserId({
        token: user?.token,
        userId: userInfo?._id,
      });
      await fetchUser();
      // setDetails();
      setActive(!active);
    } catch (error) {
      console.log(error);
    }
  };

  const Deleteuser = async () => {
    try {
      const res = await admindeleteUser({
        token: user?.token,
        userId: userInfo?._id,
      });
      await fetchUser();
      setDetails();
    } catch (error) {
      console.log(error);
    }
  };
  // const fetchFriend = async () => {
  //   const url = "/admin/detail-user/" + userInfo?.friends;
  //   const data = {
  //     // user: { userId: user?._id },
  //   };
  //   const res = await apiRequest({
  //     url: url,
  //     token: user?.token,
  //     data,
  //     method: "GET",
  //   });
  //   setInfo(res?.data);

  //   console.log(res);
  // };
  // useEffect(() => {
  //   fetchFriend();
  // }, []);
  return (
    <div className="">
      <div className="w-full h-full flex gap-7 mt-7">
        <img
          className="h-20 w-20 object-cover ml-7 rounded-full"
          src={
            userInfo?.profileUrl
              ? userInfo?.profileUrl
              : `https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg`
          }
        />
        <div className="flex flex-col w-1/6 items-end">
          <span className="text-ascent-2">{t("First name")}: </span>
          <span className="text-ascent-2">{t("Last name")}: </span>
          <span className="text-ascent-2">Id: </span>
          <span className="text-ascent-2">Email: </span>
          {/* <span className="text-ascent-2">Password: </span> */}
          {/* <span className="text-ascent-2">Join at: </span> */}
          <span className="text-ascent-2">{t("Verified")}: </span>
        </div>
        <div className="w-full text-ascent-1 text-base flex flex-col items-start">
          <span className="max-h-6 overflow-hidden">
            {userInfo?.firstName ? userInfo?.firstName : "?"}
          </span>
          <span className="max-h-6 overflow-hidden">
            {userInfo?.lastName ? userInfo?.lastName : "?"}
          </span>
          <span className="max-h-6 overflow-hidden">
            {userInfo?._id ? userInfo?._id : "?"}
          </span>
          <span className="max-h-6 overflow-hidden">
            {userInfo?.email ? userInfo?.email : "?"}
          </span>
          {/* <span className="max-h-6 overflow-hidden">
            {userInfo?.password ? userInfo?.password : "?"}
          </span> */}
          {/* <span className="max-h-6 overflow-hidden">
            {userInfo?.createdAt
              ? moment(user?.createdAt).format("MMMM Do YYYY")
              : "?"}
          </span> */}
          <span className="max-h-6 overflow-hidden">
            {userInfo?.verified === true ? "True" : "False"}
          </span>
          <div></div>
        </div>
        <div className="w-1/5 flex flex-col items-center justify-center gap-2">
          <div
            onClick={() => {
              changeActiveuser();
            }}
          >
            {active ? (
              // <div className="flex px-1 items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer border rounded-full justify-center">
              //   <CiLock /> {t("Delete")}
              // </div>
              <div className="flex px-1 items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer border rounded-full justify-center">
                <CiLock /> {t("Block")}
              </div>
            ) : (
              <div className="flex px-1 items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer border rounded-full justify-center">
                <CiUnlock /> {t("Unlock")}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              Deleteuser();
            }}
            className="inline-flex items-center text-base bg-[#ff2222] text-white px-5 py-1 mt-2 rounded-full"
          >
            {t("Delete")}
          </button>
          <button
            onClick={setDetails}
            className="inline-flex items-center text-base bg-[#0444a4] text-white px-5 py-1 mt-2 rounded-full"
          >
            {t("Back")}
          </button>
        </div>
      </div>
      {/* {userInfo.friends &&
        userInfo?.friends.map((info) => {
          <FriendsCard friends={info} />;
        })} */}
      {/* <div className="w-full h-full overflow-hidden">
        <div className="flex items-center justify-between text-ascent-1 bp-2 border-b border-[#66666645]">
          <span> Friends</span>
        </div>
        <FriendsCard friend={userInfo} />
        <FriendsCard friend={userInfo} />
        <FriendsCard friend={userInfo} />
      </div> */}
    </div>
  );
};

const History = ({ user, userInfo, handleHistory }) => {
  const [info, setInfo] = useState();
  const { t } = useTranslation();
  const fetchHistory = async () => {
    // http://localhost:8800/admin/history-activity/:idUser
    const url = "/admin/history-activity/" + userInfo?._id;
    const data = {
      // user: { userId: user?._id },
    };
    const res = await apiRequest({
      url: url,
      token: user?.token,
      data,
      method: "GET",
    });
    setInfo(res?.Activities);
  };

  useEffect(() => {
    fetchHistory();
  }, []);
  return (
    <div className="text-ascent-1 w-full h-full flex flex-col gap-5">
      <div className="mt-5 flex flex-col w-fit">
        <span className="border-b text-center">
          {userInfo?.firstName + " " + userInfo?.lastName}
        </span>
        <button
          onClick={handleHistory}
          className="w-full justify-center inline-flex items-center text-base bg-[#0444a4] text-white px-5 py-1 mt-2 rounded-full"
        >
          {t("Back")}
        </button>
      </div>
      <div className="w-full flex justify-center">
        <table className="table-fixed w-full text-center border rounded-full">
          <thead>
            <tr>
              <th>{t("Date")}</th>
              <th>{t("Time")}</th>
              <th>{t("Content")}</th>
            </tr>
          </thead>
          <tbody>
            {info?.map((one) => (
              <tr key={one?._id}>
                <td className="h-20 overflow-hidden cursor-default">
                  {one?.formattedDate}
                </td>
                <td>{one?.formattedTime}</td>
                <td>{one?.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ListUser = ({ listUser, fetchUser, setListUser }) => {
  const { user } = useSelector((state) => state.user);
  const [detail, setDetails] = useState(false);
  const { t } = useTranslation();
  const [history, setHistory] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("email");
  const [type, setType] = useState("asc");

  const handledetails = () => {
    setDetails(!detail);
  };

  const handleHistory = () => {
    setHistory(!history);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (search === "") {
      fetchUser();
    } else {
      try {
        // console.log(`/admin/search?${search}`);
        const res = await admingetUserId({
          token: user?.token,
          userId: search,
        });

        //setsuggestedFriends(res);
        setListUser([res]);
      } catch (error) {
        console.log(error);
      }
    }
  };
  //console.log(listUser);
  return (
    <div className="w-full h-full flex flex-col">
      {detail ? (
        <DetailUser
          user={user}
          userInfo={userInfo}
          setDetails={handledetails}
          setUserInfo={setUserInfo}
          fetchUser={fetchUser}
        />
      ) : (
        <>
          {history ? (
            <History
              user={user}
              userInfo={userInfo}
              handleHistory={handleHistory}
            />
          ) : (
            <div>
              <div className="w-full items-end flex flex-col ">
                <div className="w-1/2">
                  <form
                    className="hidden md:flex items-center justify-center gap-5 mt-2"
                    onSubmit={(e) => handleSearch(e)}
                  >
                    <input
                      className="bg-primary placeholder:text-[#666] pl-1 border-[#66666690] border-b w-full 
                      outline-none text-ascent-2"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                      onClick={() => {}}
                      type={"submit"}
                      className={`inline-flex items-center text-base justify-center bg-[#0444a4] text-white px-5 py-1 w-[125px] mt-2 rounded-full `}
                    >
                      {t("Search")}
                    </button>
                  </form>
                </div>
                {/* <div className="flex gap-1 shrink-0 items-center w-1/2 justify-center">
                  <label className="text-ascent-1">Filter:</label>
                  <select
                    className="bg-primary text-ascent-1 outline outline-1 focus:ring-4 rounded-full "
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="email">Email</option>
                    <option value="firstName">First Name</option>
                    <option value="timeCreated">Time Join</option>
                  </select>
                  <select
                    className=" bg-primary text-ascent-1 outline outline-1 focus:ring-4 rounded-full "
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                  </select>
                  <button
                    onClick={handleFilter}
                    className={`inline-flex items-center text-base bg-[#0444a4] text-white px-5 py-1 rounded-full`}
                  >
                    Apply
                  </button>
                  <button
                    onClick={fetchUser}
                    className={`inline-flex items-center text-base bg-[#0444a4] text-white px-5 py-1 rounded-full`}
                  >
                    Reset
                  </button>
                </div> */}
              </div>
              <div className="w-full grid grid-cols-2 gap-4  ">
                {listUser &&
                  listUser.map((user) => {
                    return (
                      <div className="flex flex-initial items-center justify-center ">
                        <UserCard
                          key={user?._id}
                          user={user}
                          setDetails={handledetails}
                          handleHistory={handleHistory}
                          setUserInfo={setUserInfo}
                        />
                      </div>
                    );
                  })}
              </div>

              {/* <UserCard
                key={user?._id}
                user={user}
                setDetails={handledetails}
                handleHistory={handleHistory}
                setUserInfo={setUserInfo}
              /> */}
              {/* {listUser?.length > 0 ? (
                listUser?.map((user) => (
                  <UserCard
                    key={user?._id}
                    user={user}
                    setDetails={handledetails}
                    handleHistory={handleHistory}
                    setUserInfo={setUserInfo}
                  />
                ))
              ) : (
                <div className="w-full h-full text-ascent-1 flex justify-center items-center">
                  Something was wrong
                </div>
              )} */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListUser;
