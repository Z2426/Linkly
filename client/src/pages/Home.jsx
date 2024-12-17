import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Cookies from "js-cookie";
import { FaUserFriends } from "react-icons/fa";

import { FaFacebookMessenger } from "react-icons/fa";

import { MdFeed } from "react-icons/md";

import { IoVideocamOutline } from "react-icons/io5";
import {
  CustomButton,
  EditFix,
  Loading,
  PostCard,
  TopBar,
  Post,
  Lastactive,
} from "../components";

// import { requests, suggest } from "../assets/data";
import { Link, useNavigate } from "react-router-dom";
import { NoProfile } from "../assets";
import {
  BsPersonFillAdd,
  BsPersonFillCheck,
  BsFiletypeGif,
} from "react-icons/bs";

import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import {
  apiRequest,
  checktoken,
  fetchNotifications,
  handFileUpload,
} from "../until";
import { dispatch } from "../redux/store";
import { Logout, UpdatePost } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { UserLogin } from "../redux/userSlice";

import {
  searchUserName,
  useracceptFriendRequest,
  userapiRequest,
  userfriendSuggest,
  usergetUserInfo,
  usersendFriendRequest,
} from "../until/user";
import { postdeletePost, postfetchPosts, postlikePost } from "../until/post";
import { debounce } from "lodash";
import { CheckedPosts, UpdatePosts } from "../redux/postSlice";
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

import { useSocket } from "../context/SocketContext";
import { useTranslation } from "react-i18next";
const Home = () => {
  const { posts } = useSelector((state) => state.posts);
  // const [postlist, setPostlist] = useState();
  const { t } = useTranslation();
  const { user, edit, notification, post } = useSelector((state) => state.user);
  const [friendRequest, setfriendRequest] = useState([]);
  const [notifications, setNotifications] = useState();
  const [suggestedFriends, setsuggestedFriends] = useState();
  const [errMsg, seterrMsg] = useState("");
  const [page, setPage] = useState(1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(false);
  const [search, setSearch] = useState("");
  const [posting, setPosting] = useState(false);
  const [listAdd, setlistAdd] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [trigger, setTrigger] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const timeoutIdRef = useRef(null);
  const [isSearch, setIsSearch] = useState(false);
  const socket = useSocket();
  // const [socket, setSocket] = useState();
  const timeoutIds = {};
  let pages = 1;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {
    setPosting(true);
    setPreview(false);
    seterrMsg("");

    try {
      // if (file.type === "video/mp4") {
      //   console.log(file);
      //   const uri = file && (await uploadVideo(file));
      // } else {
      //   console.log(file);
      //   const uri = file && (await handFileUpload(file));
      // }
      const uri = file && (await handFileUpload(file));

      const newData = uri ? { ...data, image: uri } : data;
      const res = await apiRequest({
        url: "/posts/create-post",
        data: newData,
        token: user?.token,
        method: "POST",
      });
      if (res?.status === "failed") {
        seterrMsg(res);
      } else {
        reset({
          description: "",
        });
        setFile(null);
        seterrMsg("");
        await fetchPost();
      }
      setPosting(false);
      setFile(null);
      setPreview(false);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };

  // const handlePreview = async (file) => {
  //   if (file) {
  //     console.log(file);
  //     await setFile(file);
  //     setPreview(true);
  //   }
  // };

  //console.log(user);

  const fetchPost = async () => {
    try {
      setIsFetching(true);
      await postfetchPosts(user?.token, dispatch, page);
      setLoading(false);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };
  // const fetchPostpage = async () => {
  //   try {
  //     await postfetchPosts(user?.token, dispatch);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleLikePost = async (uri) => {
    await postlikePost({ uri: uri, token: user?.token });
    // await fetchPost();
  };
  const handleDeletePost = async (id) => {
    await postdeletePost(id, user?.token);
    setLoading(true);
    setPage(1);
    setTrigger(!trigger);
    // await fetchPost();
  };
  const fetchNotification = async () => {
    try {
      const res = await fetchNotifications({
        token: user?.token,
        userId: user?._id,
        dispatch,
      });

      setNotifications(res.notifications);
    } catch (error) {
      console.log(error);
    }
  };
  const test = async () => {
    //console.log(user);
    const res = await checktoken({
      token: user?.token,
    });
    if (res?.status === "failed") {
      const message = res?.message?.message;

      Cookies.set("message", message, { expires: 7 });
      dispatch(Logout());
      navigate("/login");
      // navigate("/error");
    }
    //console.log(res);
  };
  const fetchFriendRequest = async () => {
    try {
      const res = await userapiRequest({
        url: "/friend-requests",
        user: user,
        token: user?.token,
        method: "GET",
      });

      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      setfriendRequest(res);
    } catch (error) {
      console.log(error);
    }
  };
  // const fetchSuggestFriends = async () => {
  //   try {
  //     const res = await apiRequest({
  //       url: "/users/suggested-friends",
  //       token: user?.token,
  //       method: "POST",
  //     });
  //     if (res?.status === "failed") {
  //       Cookies.set("message", res?.message, { expires: 7 });
  //       navigate("/error");
  //     }
  //     //console.log(res);
  //     setsuggestedFriends(res);
  //   } catch (error) {
  //     //console.log(error);
  //   }
  // };

  const fetchSuggestFriends = async () => {
    try {
      const res = await userfriendSuggest(user?.token, user);
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }

      setsuggestedFriends(res?.suggestedFriends);
    } catch (error) {
      //console.log(error);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      const res = await usersendFriendRequest(user.token, id);
      setlistAdd((pre) => [...pre, id]);
      await fetchSuggestFriends();
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      socket.emit("sendMessage", {
        idConversation: "friend_suggest_request",
        message: id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await useracceptFriendRequest(user?.token, id, user, status);
      fetchFriendRequest();
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUser = async () => {
    try {
      const res = await usergetUserInfo(user?.token, user?._id);
      const newData = { token: user?.token, ...res };

      dispatch(UserLogin(newData));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    if (search === "") {
      fetchSuggestFriends();
    } else {
      try {
        const res = await searchUserName(user?.token, search);

        setsuggestedFriends(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    // const timeoutIds = {}; // Đối tượng lưu timeoutId cho từng phần tử
    const sendInteraction = async (_id, postId, friendId, category) => {
      const data = {
        user_id: _id,
        friendId: friendId,
        post_id: postId,
        post_category: category ?? "music",
        action: "seen",
      };

      // console.log("Emitting user_interaction:", data);
      await socket.emit("interactPost", data);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.dataset.postId;
          const friendId = entry.target.dataset.userId;
          const postCategory = entry.target.dataset.postCategory;
          const category =
            postCategory && postCategory.length > 0 ? postCategory : "music";
          if (entry.isIntersecting) {
            // Nếu phần tử vào viewport, bắt đầu đếm thời gian
            if (timeoutIds[postId]) {
              clearTimeout(timeoutIds[postId]); // Hủy timeout cũ nếu có
            }

            // Đặt timeout 5 giây
            timeoutIds[postId] = setTimeout(() => {
              // console.log(category);
              sendInteraction(user?._id, postId, friendId, category);
              dispatch(CheckedPosts([postId]));
            }, 3000);
          } else {
            // Nếu phần tử rời khỏi viewport, hủy timeout
            if (timeoutIds[postId]) {
              clearTimeout(timeoutIds[postId]);
              delete timeoutIds[postId];
            }
          }
        });
      },
      { threshold: 0.8 } // Kích hoạt khi 100% phần tử vào viewport
    );

    // Theo dõi các phần tử
    const divElements = document.querySelectorAll(".itempost");
    divElements.forEach((div) => observer.observe(div));

    // Dọn dẹp khi component bị unmount
    return () => {
      observer.disconnect();
      Object.values(timeoutIds).forEach(clearTimeout); // Hủy tất cả timeout
    };
  }, [posts, loading]);
  useEffect(() => {
    if (page) {
      if (page == 1) {
        dispatch(UpdatePosts([]));
        fetchPost();
      } else fetchPost();
    } else fetchPost();
    // fetchPost();
  }, [page, trigger]);

  const handleScroll = useCallback(
    debounce((e) => {
      const target = e.target;

      if (
        target.scrollTop + target.clientHeight >= target.scrollHeight * 0.7 &&
        !isFetching
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 500),
    [isFetching]
  );

  const handlePage = async () => {
    setLoading(true);
    setPage(1);
    setTrigger(!trigger);
  };
  // await postrenewfetchPosts(user?.token, dispatch, 1);

  useEffect(() => {
    const postRange = document.getElementById("post_range");
    postRange.addEventListener("scroll", handleScroll);

    return () => {
      postRange.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    dispatch(UpdatePosts([]));
    setLoading(true);

    fetchFriendRequest();
    fetchSuggestFriends();
  }, []);

  useEffect(() => {
    socket &&
      socket.on("receiveMessage", (data) => {
        if (data?.message == user?._id) {
          fetchFriendRequest();
        }
      });
  }, []);

  // useEffect(() => {
  //   const newSocket = io("ws://localhost:3005", {
  //     reconnection: true,
  //     transports: ["websocket"],
  //   });

  //   setSocket(newSocket);

  //   let userId = user?._id;
  //   newSocket.emit("userOnline", { userId });

  //   return () => {
  //     let userId = user?._id;
  //     newSocket.emit("userOffline", { userId });
  //     newSocket.disconnect();
  //   };
  // }, []);

  return (
    <div>
      <div
        className="home w-full px-0 lg:px-10 pb-20 2xl-40 bg-bgColor 
    lg:rounded-lg h-screen overflow-hidden"
      >
        <TopBar user={user} />

        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-3 h-full justify-between">
          {/* {LEFT} */}
          <div className="hidden w-1/5 h-full md:flex flex-col gap-2 overflow-y-auto flex-initial">
            <div className=" w-full h-fit pb-3 flex flex-col gap-3  border-b border-ascent-2">
              <Link
                to={"/profile/" + user?._id}
                className="flex gap-2 hover:bg-ascent-3/30 w-full px-6 py-2"
              >
                <span className="text-base font-medium text-ascent-1 flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img
                      src={user?.profileUrl ?? NoProfile}
                      alt={user?.email}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>
                  {user?.firstName} {user?.lastName}
                </span>
              </Link>
              <Link
                to={"/friend"}
                className="flex gap-2 hover:bg-ascent-3/30 w-full px-6 py-2"
              >
                <span className="text-base font-medium text-ascent-1 flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <FaUserFriends size={30} />
                  </div>
                  {t("friends")}
                </span>
              </Link>

              <Link
                to={"/newfeed"}
                className="flex gap-2 hover:bg-ascent-3/30 w-full px-6 py-2"
              >
                <span className="text-base font-medium text-ascent-1 flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <MdFeed size={40} />
                  </div>
                  NewFeeed
                </span>
              </Link>

              <Link
                to={`/chat/`}
                className="flex gap-2 hover:bg-ascent-3/30 w-full px-6 py-2"
              >
                <span className="text-base font-medium text-ascent-1 flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <FaFacebookMessenger size={25} />
                  </div>
                  {t("messenger")}
                </span>
              </Link>
            </div>
            {/* <FriendsCard friend={user.friends} /> */}
            {/* {user?.friends?.map((friend) => {
              console.log(friend);

              <FriendsCard friend={user?.friends} />;
            })} */}
            <Lastactive />
          </div>
          {/* {CENTTER} bg-primary */}
          <div
            id="post_range"
            className="no-scrollbar h-full flex-initial w-2/4 px-4 flex flex-col gap-2 overflow-y-auto rounded-lg "
          >
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className="bg-primary px-4 rounded-lg"
            >
              <div className="w-full flex items-start gap-2 py-4 border-b border-[#66666645]">
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt="User Image"
                  className="w-12 h-12 rounded-full object-cover"
                />

                {/* <TextInput
                  styles="w-full rounded-full py-5"
                  placeholder="What's on your mind...."
                  name="description"
                  register={register("description", {
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message : ""}
                /> */}
                <div
                  // border border-[#66666645]
                  className=" text-ascent-2 rounded-full  pt-2 w-full pb-10 hover:cursor-text"
                  onClick={() => {
                    dispatch(UpdatePost(true));
                  }}
                >
                  <div className="px-8 text-lg">
                    {t("what's on your mind....")}
                  </div>
                </div>
              </div>

              {
                <div
                  className="flex items-center justify-start gap-2 py-4"
                  // onClick={() => {
                  //   dispatch(UpdatePost(true));
                  // }}
                >
                  <label
                    htmlFor="imgUpload"
                    className="flex items-center gap-1 text-base text-ascent-2  cursor-pointer"
                  >
                    {/* <input
                    type="file"
                    onChange={(e) => handlePreview(e.target.files[0])}
                    className="hidden"
                    id="imgUpload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg"
                  /> */}
                    <BiImages />
                    <div className="w-[70px]">{t("image")}</div>
                  </label>

                  <label
                    htmlFor="videoUpload"
                    className="flex items-center gap-1 text-base text-ascent-2  cursor-pointer"
                  >
                    {/* <input
                    type="file"
                    onChange={(e) => handlePreview(e.target.files[0])}
                    className="hidden"
                    id="videoUpload"
                    data-max-size="5120"
                    accept=".mp4, .wav"
                  /> */}
                    <IoVideocamOutline size={20} />
                    <span>Video</span>
                  </label>

                  {/* <label
                    htmlFor="vgifUpload"
                    className="flex items-center gap-1 text-base text-ascent-2  cursor-pointer"
                  >
                     <input
                    type="file"
                    onChange={(e) => handlePreview(e.target.files[0])}
                    className="hidden"
                    id="vgifUpload"
                    data-max-size="5120"
                    accept=".gif"
                  /> 
                    <BsFiletypeGif />
                    <span>Gif</span>
                  </label> */}

                  {/* <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      tittle="Post"
                      containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                    />
                  )}
                </div> */}
                  <div className="w-full flex items-end justify-end">
                    <CustomButton
                      type="submit"
                      tittle={t("Post")}
                      containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm "
                    />
                  </div>
                </div>
              }
            </form>

            {loading ? (
              <Loading />
            ) : posts && posts?.length > 0 ? (
              posts?.map((post, index) => (
                <div
                  className="itempost"
                  key={post._id}
                  data-post-id={post._id}
                  data-post-category={post.categories}
                  data-user-id={post.userId}
                  post={post}
                >
                  <PostCard
                    // key={index}
                    posts={post}
                    user={user}
                    deletePost={handleDeletePost}
                    likePost={handleLikePost}
                    isCheck={post?.isCheck}
                    socekt={socket}
                  />
                </div>
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">
                  {t("no post pvailable")}
                </p>
              </div>
            )}
            {posts && posts?.length > 0 && !loading && <Loading />}
          </div>
          {/* {RIGHT} */}
          <div className="hidden w-1/5 h-full lg:flex flex-col gap-2 flex-initial px-2 pb-4">
            {/* {FRIEND REQUEST} */}
            <div className="w-full border-b border-ascent-2 shadow-sm max-h-[50%] flex flex-col py-5">
              <div
                className="flex items-center justify-between text-sm text-ascent-1 
            pb-2 "
              >
                <span className="font-medium text-lg text-ascent-2">
                  {t("friend request")}
                </span>
              </div>

              <div className="w-full flex flex-col gap-4 pt-4 h-full overflow-auto">
                {friendRequest &&
                  friendRequest.length > 0 &&
                  friendRequest?.map(({ _id, sender }) => (
                    <div
                      key={sender?._id}
                      className="flex items-center justify-between "
                    >
                      <Link
                        to={"/profile/" + sender?._id}
                        className="w-full flex gap-4 items-center 
                          cursor-pointer "
                      >
                        <img
                          src={sender?.profileUrl ?? NoProfile}
                          alt={sender?.firstName}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-base font-medium text-ascent-1">
                            {sender?.firstName} {sender?.lastName}
                          </p>
                          <span className="text-sm text-ascent-2">
                            {t("Request")}
                          </span>
                        </div>
                      </Link>
                      <div className="flex gap-1">
                        <CustomButton
                          tittle={t("accept")}
                          onClick={() => acceptFriendRequest(_id, "accepted")}
                          containerStyles="bg-[#0444a4] flex items-center justify-center w-[60px] text-xs text-white px-1.5 
                    py-1 rounded-full"
                        />
                        <CustomButton
                          tittle={t("Delete")}
                          onClick={() => acceptFriendRequest(_id, "rejected")}
                          containerStyles="border border-[#666] text-xs
                    text-ascent-1 px-1.5 py-1 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {/* <Lastactive /> */}
            {/* <div className="w-full h-fit max-h-1/2 shadow-sm ">
              <span className="font-medium text-lg text-ascent-2 select-none">
                Friends
              </span>
              <div className="w-full h-full overflow-y-auto pb-7">
                <FriendsCard friend={user.friends} />
              </div>
            </div> */}

            {/* {user?.friends?.map((friend) => {
              console.log(friend);

              <FriendsCard friend={user?.friends} />;
            })} */}
            {/* {SUGGEST FRIENDS} */}
            <div className="w-full h-1/2 shadow-sm bg-bgColor">
              {!isSearch && (
                <div className="flex items-center justify-between text-sm text-ascent-1 ">
                  <span className="font-medium text-lg text-ascent-2 select-none">
                    {t("friend suggestion")}
                  </span>
                  <div
                    className="flex items-center justify-center text-ascent-2 cursor-pointer"
                    onClick={() => setIsSearch(true)}
                  >
                    <CiSearch size={20} />
                  </div>
                </div>
              )}
              {isSearch && (
                <form
                  className="hidden md:flex items-center justify-center gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  {/* <TextInput
                      styles="w-full rounded-l-full py-5"
                      placeholder="What's on your mind...."
                      register={register("search")}
                    /> */}
                  <input
                    className="bg-bgColor placeholder:text-[#666] border-[#66666690] border-b w-4/5 
                      outline-none text-ascent-2"
                    placeholder={t("Search")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div
                    className="flex items-center justify-center text-ascent-2 cursor-pointer"
                    onClick={() => {
                      setIsSearch(false);
                      setSearch("");
                    }}
                  >
                    <IoMdClose size={20} />
                  </div>
                  {/* <CustomButton
                      tittle="search"
                      type="submit"
                      containerStyles="bg-[#0444a4] text-white px-5 py-1 mt-2 rounded-full"
                    /> */}

                  {/* <button
                  onClick={() => {}}
                  type={"submit"}
                  className={`inline-flex items-center text-base bg-[#0444a4] text-white px-5 py-1 mt-2 rounded-full`}
                >
                  search
                </button> */}
                </form>
              )}

              <div className="w-full h-full flex flex-col pt-4 overflow-auto ">
                {suggestedFriends &&
                  suggestedFriends?.map((friend) => {
                    return (
                      <div
                        className="flex items-center justify-between  py-2 px-2 select-none"
                        key={friend._id}
                      >
                        <Link
                          to={"/profile/" + friend?._id}
                          // key={friend._id}
                          className="w-full flex gap-4 items-center 
                  cursor-pointer"
                        >
                          <img
                            src={friend?.profileUrl ?? NoProfile}
                            alt={friend?.firstName}
                            className="w-10 h-10 object-cover rounded-full"
                          />

                          <div className="flex-1">
                            <p className="text-base font-medium text-ascent-1">
                              {friend?.firstName} {friend?.lastName}
                            </p>
                            <span className="text-sm text-ascent-2">
                              {friend?.profession ?? t("No Profession")}
                            </span>
                          </div>
                        </Link>

                        <div className="flex gap-1">
                          {listAdd && !listAdd.includes(friend?._id) ? (
                            <button
                              className="bg-[#0444a430] text-sm text-white p-1 rounded"
                              onClick={() => handleFriendRequest(friend?._id)}
                            >
                              <BsPersonFillAdd
                                size={20}
                                className="text-[#0f52b6]"
                              />
                            </button>
                          ) : (
                            <button className="bg-ascent-2/30 text-sm text-white p-1 rounded">
                              <BsPersonFillCheck
                                size={20}
                                className="text-ascent-2"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {/* <div className="absolute w-1/3 h-2/5 bg-transparent bottom-10 right-10">
            <ChatCard />
          </div> */}
        </div>
      </div>

      {edit && <EditFix />}
      {post && <Post setPage={handlePage} />}

      {/* {picreview && <ImageCheck />} */}
    </div>
  );
};

export default Home;
