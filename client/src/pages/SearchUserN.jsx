import React, { useEffect, useState } from "react";
import { EditFix, TopBar } from "../components";
import { Link, useParams } from "react-router-dom";
import { NoProfile } from "../assets";
import { useSelector } from "react-redux";

import { Loading } from "../components/index";
import { useDispatch } from "react-redux";
import { postlikePost } from "../until/post";

import {
  searchUserName,
  usergetUserInfo,
  usersendFriendRequest,
} from "../until/user";
import { useTranslation } from "react-i18next";
import { useSocket } from "../context/SocketContext";

const UserCard = ({ token, user, isFriend }) => {
  const socket = useSocket();
  const [idAdd, setIsAdd] = useState(false);
  const { t } = useTranslation();
  const handleFriendRequest = async (id) => {
    try {
      const res = await usersendFriendRequest(token, id);
      socket.emit("sendMessage", {
        idConversation: "friend_suggest_request",
        message: id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-xl shadow-lg bg-primary w-[375px] h-full px-5 border border-[#66666645]">
      <div
        className="my-4 flex gap-5 w-full h-full justify-between cursor-pointer"
        onClick={() => {}}
      >
        <Link to={"/profile/" + user?._id} className="">
          <img
            className="h-20 w-20 object-cover rounded-full"
            src={user?.profileUrl ?? NoProfile}
            alt="Avatar"
          />
        </Link>

        <div className="w-2/3 overflow-hidden">
          <Link to={"/profile/" + user?._id} className="">
            {" "}
            <div className="flex w-full gap-4">
              <div className="flex flex-col text-right">
                <span className="text-ascent-2">{t("Name")}: </span>
              </div>
              <div className="w-full text-ascent-1 text-base flex flex-col items-start">
                <span className="max-h-6 overflow-hidden">
                  {user?.firstName ? user?.firstName : "?"}{" "}
                  {user?.lastName ? user?.lastName : "?"}
                </span>
              </div>
            </div>
          </Link>

          {!isFriend ? (
            !idAdd ? (
              <div
                onClick={() => {
                  setIsAdd(true);
                  handleFriendRequest(user?._id);
                }}
                className="mt-5 text-white bg-blue w-full py-2 rounded-lg flex items-center justify-center"
              >
                {t("Add")}
              </div>
            ) : (
              <div className="mt-5 text-ascent-2  bg-ascent-3/30 w-full py-2 rounded-lg flex items-center justify-center">
                {t("Added")}
              </div>
            )
          ) : (
            <div className="mt-5 text-ascent-2  bg-ascent-3/30 w-full py-2 rounded-lg flex items-center justify-center">
              {t("Added")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchUserN = () => {
  const { keyword } = useParams();
  const [key, setKey] = useState(`${keyword}`);
  const { t } = useTranslation();
  const { user, edit } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [listUser, setListUser] = useState([]);
  const [friends, setFriends] = useState([]);

  const getFriend = async () => {
    const res = await usergetUserInfo(user?.token, user?._id);

    setFriends(res?.friends);
  };
  const handleSearch = async (keyword) => {
    try {
      const prompt = keyword;

      const res = await searchUserName(user?.token, prompt);
      // console.log(res);

      setListUser(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePost = async (uri) => {
    await postlikePost({ uri: uri, token: user?.token });
  };
  useEffect(() => {
    setLoading(true);
    getFriend();
    handleSearch(keyword);
    // fetchPost();
    // let timeoutId;
    // timeoutId = setTimeout(() => {
    //   keyword && handleSearch(keyword);
    // }, 3000);

    // return () => {
    //   clearTimeout(timeoutId);
    // };
  }, [keyword]);

  return (
    <div>
      <div
        className="home w-full px-0 lg:px-10 pb-20 2xl-40 bg-bgColor 
lg:rounded-lg h-screen overflow-hidden"
      >
        <TopBar user={user} setKey={setKey} />
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full justify-between">
          <div className=" justify-center h-full flex-initial w-full flex-wrap px-4 py-4 flex gap-6 overflow-y-auto rounded-lg">
            <div>
              <div className="w-full h-fit flex flex-wrap gap-2 select-none">
                <div className="flex justify-center items-center flex-col">
                  <div className="w-full h-fit flex gap-2 flex-wrap justify-center">
                    <div className="w-full h-fit flex flex-col items-center justify-center shrink-0">
                      {loading ? (
                        <div className="w-full h-full">
                          <Loading />
                        </div>
                      ) : (
                        <div className="w-full grid grid-cols-2 gap-4 ">
                          {listUser && listUser.length > 0 ? (
                            listUser.map((users) => {
                              return (
                                <UserCard
                                  key={users?._id}
                                  token={user?.token}
                                  user={users}
                                  isFriend={friends?.includes(users?._id)}
                                />
                              );
                            })
                          ) : (
                            <div>{t("Not found")}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {edit && <EditFix />}
      </div>
    </div>
  );
};

export default SearchUserN;
