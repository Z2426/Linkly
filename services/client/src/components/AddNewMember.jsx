import React, { useEffect, useState } from "react";

import UserTiitle from "./UserTiitle";
import CustomButton from "./CustomButton";

import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { searchUserName, userfriendSuggest } from "../until/user";

import { addMemberGroup } from "../until/group";

import AddUserCard from "./AddUserCard";
import { useTranslation } from "react-i18next";
const AddNewMember = ({ idroom, setAddu }) => {
  const { user } = useSelector((state) => state.user);
  const [listsuggest, setListsuggest] = useState([]);
  const [listAdd, setListAdd] = useState([]);
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [search, setSearch] = useState("");
  const [description, setDescription] = useState("");
  const { t } = useTranslation();
  const fetchSuggestFriends = async () => {
    try {
      const res = await userfriendSuggest(user?.token, user);
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }

      setListsuggest(res?.suggestedFriends);
    } catch (error) {
      console.log(error);
    }
  };
  const handledelete = (id) => {
    const array = [...listAdd];
    let newarray = array.filter((item) => item !== id);
    setListAdd(newarray);
  };

  const handleSearch = async (e) => {
    // e.preventDefault();
    // console.log(e);

    if (search === "") {
      fetchSuggestFriends();
    } else {
      try {
        const res = await searchUserName(user?.token, search);

        setListsuggest(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const id_1 = user?._id;

      const res =
        listAdd.length > 0 &&
        (await addMemberGroup(user?.token, id_1, idroom, listAdd));

      setAddu(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handdlelistadd = (id) => {
    const lista = [...listAdd];
    !lista?.includes(id) && lista.push(id);

    setListAdd(lista);
  };
  // useEffect(() => {
  //   fetchSuggestFriends();
  // }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(search);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);
  return (
    <div className="absolute w-full h-full  z-50 ">
      <div className="fixed inset-0 transition-opacticy">
        <div className="absolute inset-0 bg-[#000] opacity-70 z-0"></div>
      </div>
      <div className="absolute w-full h-full flex justify-center items-center">
        <div className="bg-primary px-3 py-3 flex flex-col gap-4 w-1/5 h-[50%] rounded-2xl">
          <div className="w-full flex px-3 pb-3 border-b border-[#66666645]">
            <span className="text-ascent-1 w-full flex items-center justify-between text-xl font-medium ">
              {t("Add Member")}
              <div
                className="text-ascent-1 h-full flex items-center cursor-pointer"
                onClick={() => {
                  setAddu(false);
                }}
              >
                <MdClose size={25} />
              </div>
            </span>
          </div>
          <div className="flex w-full justify-end items-center gap-3 ">
            <span className="text-ascent-1 whitespace-nowrap">
              {t("Member")}
            </span>

            <input
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="bg-bgColor outline-none px-4 py-2 rounded-full w-full text-ascent-1"
              placeholder={t("Search")}
            />
          </div>

          <div className="content-start border-b border-[#66666645] pb-2 h-2/5 bg-primary gap-2 overflow-y-auto flex flex-wrap justify-center ">
            {listsuggest &&
              listsuggest.map((suggest) => {
                return (
                  <div
                    onClick={() => {
                      handdlelistadd(suggest?._id);
                    }}
                    key={suggest?._id}
                    className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl"
                  >
                    <AddUserCard useradd={suggest?._id} />
                    {/* <img
                        src={
                          suggest?.profileUrl ? suggest?.profileUrl : NoProfile
                        }
                        alt=""
                        className="h-5 w-5 rounded-full object-cover"
                      />
                      {suggest?.firstName}
                      <IoIosAddCircle /> */}
                  </div>
                );
              })}
          </div>
          <div className="h-2/5 flex flex-wrap gap-2 overflow-y-auto content-start justify-center">
            {listAdd &&
              listAdd.map((useradd) => {
                return (
                  <div
                    onClick={() => {
                      handledelete(useradd);
                    }}
                  >
                    <UserTiitle useradd={useradd} />
                  </div>
                );
              })}
          </div>

          <div className="w-full flex justify-end">
            <CustomButton
              tittle={t("Submit")}
              containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white"
              onClick={() => {
                handleSubmit();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewMember;
