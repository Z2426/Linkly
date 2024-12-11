import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDown } from "react-icons/ai";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { UpdatePost, UpdateProfile, UserLogin } from "../redux/userSlice";
import { handFileUpload } from "../until";
import { FaEarthAfrica } from "react-icons/fa6";

import { CiImageOn, CiShoppingTag } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { NoProfile } from "../assets";

import { postedit, postfetchPosts } from "../until/post";
import UserTiitle from "./UserTiitle";
import { usergetFriends } from "../until/user";
import { useTranslation } from "react-i18next";
const Editpost = ({ onEvent, post, onClick, setPost }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, seterrMsg] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [picture, setPicuter] = useState(null);
  const [content, setContent] = useState(post.description);
  const [images, setImages] = useState([]);
  const { t } = useTranslation();
  const [preview, setPreview] = useState(false);
  const [write, setWrite] = useState(true);
  const [audience, setAudience] = useState(false);
  const [specific, setSpecific] = useState(false);
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [review, setReview] = useState(post?.image ? post?.image : null);

  const [tem, setTem] = useState();
  const [friends, setFriends] = useState([]);
  const [lists, setLists] = useState([]);
  const [option, setOption] = useState("public");

  const set = setPost;

  const handlebg = (e) => {
    setFile(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setReview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    setPreview(true);
  };
  const pushList = (id) => {
    let memo = [...lists];

    lists.includes(id)
      ? (memo = lists.filter((memo) => memo != id))
      : memo.push(id);

    setLists(memo);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePreview = async (file) => {
    if (file) {
      await setFile(file);
      setPreview(true);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await usergetFriends(user?.token);
      setFriends(res?.friends);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPost = async () => {
    try {
      await postfetchPosts(user?.token, dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostSubmit = async (data) => {
    setPosting(true);
    setPreview(false);
    seterrMsg("");
    data.visibility = option;

    try {
      const uri = file ? await handFileUpload(file) : post?.image;

      const newData = uri ? { ...data, image: uri } : data;

      const postId = post?._id;

      const res = await postedit(postId, user?.token, newData);

      set(res?.updatedPost);

      if (res?.status === "failed") {
        seterrMsg(res);
      } else {
        reset({
          description: "",
        });
        setFile(null);
        seterrMsg("");
      }
      setPosting(false);
      setFile(null);
      setPreview(false);

      const close = onClick;
      close();
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };

  const handleClose = () => {
    dispatch(UpdatePost(false));
  };
  const handleSelect = (e) => {
    setPicuter(e.target.files[0]);
  };
  useEffect(() => {
    review ? setPreview(true) : setPreview(false);
    fetchPost();
    fetchFriends();
  }, []);

  return (
    <div>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div
          className="flex items-center justify-center min-h-screen pt-4
            px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div className="fixed inset-0 transition-opacticy">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>
          <span className="h-full w-full flex justify-center items-center sm:inline-block sm:align-middle sm:h-screen  select-none">
            <form onSubmit={handleSubmit(handlePostSubmit)}>
              <div
                className="inline-block align-bottom bg-primary rounded-3xl
            text-left overflow-hidden shadow-xl transform transition-all
            sm:my-10 sm:align-middle sm:max-w-md sm:w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="flex justify-between px-6 pt-5 pb-2">
                  <label
                    htmlFor="name"
                    className="block w-full  text-xl text-ascent-1 text-center font-bold"
                  >
                    {t("Edit Post")}
                  </label>

                  <button className="text-ascent-1" onClick={onClick}>
                    <MdClose size={22} />
                  </button>
                </div>
                <div className="flex flex-col relative">
                  {write && (
                    <div className="w-full h-full">
                      <div className="flex justify-center items-center ">
                        <div
                          className="bg-secondary text-ascent-1 px-2 py-1 opacity-70 flex justify-center items-center gap-1"
                          onClick={() => {
                            setAudience(true);
                            // setWrite(false);
                          }}
                        >
                          <FaEarthAfrica />
                          {option} <AiOutlineDown size={15} />
                        </div>
                      </div>
                      <div className="flex justify-between px-6 pt-5 pb-2">
                        <label
                          htmlFor="name"
                          className="block font-medium text-xl text-ascent-1 text-left py-7 box-border"
                        ></label>
                        <div className="w-full h-full flex-col-reverse m-3 gap-8">
                          <textarea
                            {...register("description", {
                              required: "Write something about post",
                            })}
                            error={
                              errors.description
                                ? errors.description.message
                                : ""
                            }
                            className="w-full h-72  bg-primary rounded-3xl border-none
            outline-none text-xl text-ascent-1 
            px-4 py-3 placeholder:text-ascent-2 placeholder:text-3xl resize-none"
                            value={content}
                            placeholder="Write something about post"
                            onChange={(ev) => {
                              setContent(ev.target.value);
                            }}
                          />
                          {preview && (
                            <div className="py-4 w-full flex justify-center gap-3 ">
                              <div
                                className="flex relative w-full  rounded-xl overflow-hidden"
                                onClick={() => {}}
                              >
                                <img src={review} alt="Something wrong" />
                                <div
                                  onClick={() => {
                                    setPreview(false);
                                    setFile(null);
                                  }}
                                  className="rotate-45 cursor-pointer absolute right-1 top-1 bg-[#000000] aspect-square rounded-full opacity-90 w-6 h-6 text-white flex justify-center items-center"
                                >
                                  <AiOutlinePlus />
                                </div>
                              </div>
                            </div>
                          )}
                          {!posting && (
                            <div className="flex gap-3">
                              <div className="w-fit py-1 flex outline-1 px-3 text-[#04c922] bg-primary rounded-full outline  justify-center items-center cursor-pointer ">
                                <CiShoppingTag />
                                <div className="hover:text-ascent-1">Tags</div>
                              </div>

                              <div className="w-fit py-1 flex outline-1 px-3 text-[#345cd9] bg-primary rounded-full outline  justify-center items-center cursor-pointer">
                                <label
                                  htmlFor="imgUpload"
                                  className="flex items-center gap-1 text-base text-[#345cd9] hover:text-ascent-1 cursor-pointer"
                                >
                                  <input
                                    type="file"
                                    onChange={(e) => {
                                      e.target.files[0] && handlebg(e);
                                    }}
                                    className="hidden"
                                    id="imgUpload"
                                    data-max-size="5120"
                                    accept=".jpg, .png, .jpeg"
                                  />
                                  <CiImageOn />
                                  {t("Image")}
                                </label>
                              </div>
                            </div>
                          )}

                          <div className="w-full flex justify-end">
                            {posting ? (
                              <div className="w-full flex justify-center items-center mx-2">
                                <Loading />
                              </div>
                            ) : (
                              <CustomButton
                                type="submit"
                                Post
                                onClick={() => {
                                  // console.log("press");
                                }}
                                containerStyles={`inline-flex justify-center rounded-full bg-blue px-8
                    py-3 text-sm font-medium text-white outline-none`}
                                tittle={t("Submit")}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {audience && (
                    <div className="bg-primary absolute w-full h-full flex flex-col justify-between">
                      <div className="flex w-full h-full select-none overflow-y-auto my-5">
                        <div
                          className="w-full h-72 mb-20 rounded-3xl border-none
            outline-none text-xl text-ascent-1 px-5 py-3 placeholder:text-ascent-2 "
                        >
                          <label
                            htmlFor="default-radio-1"
                            className="items-center mb-4 select-none w-full bg-primary flex px-5 py-2 justify-between hover:bg-ascent-3/30 rounded-xl"
                          >
                            <label
                              htmlFor="default-radio-1"
                              className="ms-2 text-gray-900 dark:text-gray-300 font-medium"
                            >
                              {t("Public")}
                              <br />
                              <span className="text-ascent-2 text-base">
                                {t("Anyone can see")}
                              </span>
                            </label>
                            <input
                              id="default-radio-1"
                              type="radio"
                              value="public"
                              name="auth"
                              onChange={(e) => {
                                setOption(e.target.value);
                              }}
                              className="w-5 h-5 text-blue-600  border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 
                            dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
                            />
                          </label>
                          <label
                            htmlFor="default-radio-2"
                            className="items-center mb-4 select-none w-full bg-primary flex px-5 py-2 justify-between hover:bg-ascent-3/30 rounded-xl"
                          >
                            <label
                              htmlFor="default-radio-2"
                              className="ms-2 text-gray-900 dark:text-gray-300 font-medium"
                            >
                              {t("Specific friends")}
                              <br />
                              <span className="text-ascent-2 text-base">
                                {t("Only show to some friends")}
                              </span>
                            </label>
                            <input
                              id="default-radio-2"
                              type="radio"
                              value="specific"
                              name="auth"
                              onChange={(e) => {
                                setOption(e.target.value);
                                setSpecific(!specific);
                              }}
                              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </label>
                          <label
                            htmlFor="default-radio-3"
                            className="items-center mb-4 select-none w-full bg-primary flex px-5 py-2 justify-between hover:bg-ascent-3/30 rounded-xl"
                          >
                            <label
                              htmlFor="default-radio-3"
                              className="ms-2 text-gray-900 dark:text-gray-300 font-medium"
                            >
                              {t("Friends")}
                              <br />
                              <span className="text-ascent-3 text-base">
                                {t("Your friends")}
                              </span>
                            </label>
                            <input
                              id="default-radio-3"
                              type="radio"
                              value="friends"
                              name="auth"
                              onChange={(e) => {
                                setOption(e.target.value);
                              }}
                              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </label>
                          <label
                            htmlFor="default-radio-4"
                            className="items-center mb-4 select-none w-full bg-primary flex px-5 py-2 justify-between hover:bg-ascent-3/30 rounded-xl"
                          >
                            <label
                              htmlFor="default-radio-4"
                              className="ms-2 text-gray-900 dark:text-gray-300 font-medium"
                            >
                              {t("Only me")}
                              <br />
                              <span className="text-ascent-2 text-base">
                                {t("Only show to you")}
                              </span>
                            </label>
                            <input
                              id="default-radio-4"
                              type="radio"
                              value="only me"
                              name="auth"
                              onChange={(e) => {
                                setOption(e.target.value);
                              }}
                              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </label>
                        </div>
                      </div>
                      <div className=" flex justify-between px-6">
                        <div className="w-full flex m-3 justify-between items-center">
                          <CustomButton
                            type=""
                            Post
                            onClick={() => {
                              setAudience(false);
                              setWrite(true);
                            }}
                            containerStyles={`inline-flex justify-center rounded-full underline underline-offset-2 px-8
                    py-3 text-sm font-medium text-ascent-1 outline-none`}
                            tittle={t("Back")}
                          />
                          <div className="w-full h-full flex-col-reverse gap-80">
                            <div className="w-full flex justify-end">
                              <CustomButton
                                type=""
                                Post
                                onClick={() => {
                                  setAudience(!audience);
                                  // setWrite(!write);
                                  // console.log("press");
                                }}
                                containerStyles={`inline-flex justify-center rounded-full bg-blue px-8
                    py-3 text-sm font-medium text-white outline-none`}
                                tittle={t("Done")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {specific && (
                    <div className="bg-primary absolute w-full h-full flex flex-col justify-between">
                      <div className="flex w-full h-full select-none overflow-y-auto my-5">
                        <div
                          className="w-full h-full mb-20 rounded-3xl border-none
          outline-none text-xl text-ascent-1 px-5 py-3 placeholder:text-ascent-2"
                        >
                          <input
                            type="text"
                            className="w-full my-2 bg-secondary outline-none px-5 py-2 rounded-full "
                            placeholder={t("Search")}
                          />
                          <div className="w-full flex items-center justify-center">
                            <div className="flex flex-wrap gap-2 justify-center mb-2 items-center">
                              {lists.length > 0 &&
                                lists?.map((friend) => {
                                  var check = lists.includes(friend?._id);
                                  return (
                                    <div
                                      key={friend?._id}
                                      onClick={() => {
                                        pushList(friend);
                                      }}
                                    >
                                      <UserTiitle useradd={friend} />
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                          <div className="w-full h-full ">
                            {friends &&
                              friends.map((friend) => {
                                var check = lists.includes(friend?._id);

                                return (
                                  <div
                                    onClick={() => {
                                      pushList(friend?._id);
                                    }}
                                    className={`${
                                      check ? "bg-ascent-3/10" : ""
                                    }  items-center mb-4 select-none w-full flex px-5 py-2 justify-between hover:bg-ascent-3/30 rounded-xl`}
                                  >
                                    <div className="ms-2 text-gray-900 dark:text-gray-300 font-medium flex">
                                      <img
                                        src={friend?.profileUrl ?? NoProfile}
                                        alt=""
                                        className="h-12 w-12 object-cover rounded-full mr-3"
                                      />
                                      <div
                                        id={friend._id}
                                        className="h-full flex justify-center items-center"
                                      >
                                        {friend.firstName} {friend.lastName}
                                        <br />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                      <div className=" flex justify-between px-6">
                        <div className="w-full flex m-3 justify-between items-center">
                          <CustomButton
                            type=""
                            Post
                            onClick={() => {
                              setLists([]);
                              setSpecific(!specific);
                            }}
                            containerStyles={`inline-flex justify-center rounded-full underline underline-offset-2 px-8
                  py-3 text-sm font-medium text-ascent-1 outline-none`}
                            tittle={t("Back")}
                          />
                          <div className="w-full h-full flex-col-reverse gap-80">
                            <div className="w-full flex justify-end">
                              <CustomButton
                                type=""
                                Post
                                onClick={() => {
                                  // setAudience(!audience);
                                  setSpecific(!specific);
                                }}
                                containerStyles={`inline-flex justify-center rounded-full bg-blue px-8
                  py-3 text-sm font-medium text-white outline-none`}
                                tittle={t("Done")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Editpost;
